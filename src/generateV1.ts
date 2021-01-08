import * as dotenv from "dotenv";
dotenv.config();
import BigNumber from "bignumber.js";
import { BITBOX as BITBOXSDK, ECPair } from "bitbox-sdk";
import * as crypto from "crypto";
import { BlockNotification, ClientReadableStream,
            GetMempoolResponse, GrpcClient,
            TransactionNotification } from "grpc-bchrpc-node";
import { BchdNetwork, LocalValidator,
         ScriptSigP2PK, ScriptSigP2PKH,
         ScriptSigP2SH, Slp, SlpAddressUtxoResult,
         SlpTransactionDetails, SlpTransactionType,
         TransactionHelpers, Utils,
         Validation } from "slpjs";         
import { ValidityCache } from "./cache";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const childProcess = require("child_process");
const execute = (command: any) => {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, (error: any, standardOutput: any, standardError: any) => {
            if (error) {
                reject();
                return;
            }
            if (standardError) {
                reject(standardError);
                return;
            }
            resolve(standardOutput);
        });
    });
};

const BITBOX = new BITBOXSDK();
const slp = new Slp(BITBOX);
const txnHelpers = new TransactionHelpers(slp);

import bchaddr from "bchaddrjs-slp";
const Bitcore = require("bitcoincashjs-lib-p2sh");

let client: GrpcClient;
if (process.env.BCHD_GRPC_CERT) {
    client = new GrpcClient({ url: process.env.BCHD_GRPC_URL, rootCertPath: process.env.BCHD_GRPC_CERT });
} else {
    client = new GrpcClient({ url: process.env.BCHD_GRPC_URL });
}

const minerWif: string = process.env.WIF!;
const minerPubKey = (new ECPair().fromWIF(minerWif)).getPublicKeyBuffer();
const minerBchAddress = Utils.toCashAddress((new ECPair().fromWIF(minerWif)).getAddress());
const minerSlpAddress = Utils.toSlpAddress(minerBchAddress);
const vaultHexTail = process.env.MINER_COVENANT_V1!;
const tokenStartBlock = parseInt(process.env.TOKEN_START_BLOCK_V1 as string, 10);

const sp = require("synchronized-promise");

// method to get transactions
const getRawTransactions = async (txids: string[]) => {
    if (txids.length !== 1) {
        throw Error("only supporting a single transaction");
    }
    let txnBuf;
    if (ValidityCache.txnCache.has(txids[0])) {
        console.log(`Cache txid: ${txids[0]}`);
        return [ ValidityCache.txnCache.get(txids[0])!.toString("hex") ];
    }
    console.log(`Downloading txid: ${txids[0]}`);

    try {
        const res = await client.getRawTransaction({ hash: txids[0], reversedHashOrder: true });
        console.log("Downloaded from BCHD");
        txnBuf = Buffer.from(res.getTransaction_asU8());
    } catch (_) {
        throw Error(`[ERROR] Could not get transaction ${txids[0]}`);
    }

    ValidityCache.txnCache.set(txids[0], txnBuf);
    return [ txnBuf.toString("hex") ];
};

// setup a new local SLP validator
const validator = new LocalValidator(BITBOX, getRawTransactions);
const network = new BchdNetwork({BITBOX, client, validator});

const getRewardAmount = (block: number) => {
    const initReward = parseInt(process.env.TOKEN_INIT_REWARD_V1 as string, 10);
    const halveningInterval = parseInt(process.env.TOKEN_HALVING_INTERVAL_V1 as string, 10);
    return Math.floor(initReward / (Math.floor(block / halveningInterval) + 1));
};

interface IState {
    bchdMintTxnSeen: boolean;
    bestBlockchainHeight: number;
    bestTokenHeight: number;
    hasSeenAtLeastOneBlock: boolean;
    lastBatonTxid: string;
}

const defaultState: IState = {
    bchdMintTxnSeen: false,
    bestBlockchainHeight: 0,
    bestTokenHeight: 0,
    hasSeenAtLeastOneBlock: false,
    lastBatonTxid: "",
};
let state: IState = JSON.parse(JSON.stringify(defaultState));

const minerTags = new Map<number, {tag: string, txid: string, conf: number}>();

interface IStreams {
    bchdBlocks: null|ClientReadableStream<BlockNotification>;
    bchdTransactions: null|ClientReadableStream<TransactionNotification>;
}

const streams: IStreams = {
    bchdBlocks: null,
    bchdTransactions: null,
};

// get current block height and listen for new blocks
streams.bchdBlocks = sp(async () => {
    return await client.subscribeBlocks({
        includeSerializedBlock: false, includeTxnData: true, includeTxnHashes: false
    });
})();

streams.bchdBlocks!.on("data", async (data: BlockNotification) => {
    state.bestBlockchainHeight = data.getBlockInfo()!.getHeight();
    console.log(`Block found: ${state.bestBlockchainHeight}.`);
    //await processTxnList(data.getMarshaledgetTransactionDataList());
});

streams.bchdTransactions = sp(async () => {
    return await client.subscribeTransactions({
        includeBlockAcceptance: false, includeMempoolAcceptance: true, includeSerializedTxn: false,
    });
})();

streams.bchdTransactions!.on("data", async (data: TransactionNotification) => {
    const type = data.getType();
    const txn = data.getUnconfirmedTransaction()!.getTransaction()!;
    const outs = txn.getOutputsList();
    if (Buffer.from(outs[0].getPubkeyScript_asU8()).toString("hex").includes("044d494e5420d6876f0fce603be43f15d34348bb1de1a8d688e1152596543da033a060cff798")) {
        const ins = txn.getInputsList();
        const asm = BITBOX.Script.toASM(Buffer.from(ins[0].getSignatureScript_asU8())).split(" ");
        try {
            const tokenHeight = Buffer.from(asm[0], "hex").readUInt32LE();
            if (tokenHeight > state.bestTokenHeight) {
                state.bchdMintTxnSeen = true;
                state.lastBatonTxid = Buffer.from(txn.getHash_asU8()).toString("hex");
            }

            // add miner tag
            const scriptSig = Buffer.from(txn.getInputsList()[0].getSignatureScript_asU8());
            const scriptSigAsm = BITBOX.Script.toASM(scriptSig).split(" ");
            minerTags.set(tokenHeight, {
                conf: txn.getConfirmations(),
                tag: Buffer.from(scriptSigAsm[6], "hex").toString("utf-8"),
                txid: Buffer.from(txn.getHash_asU8().slice().reverse()).toString("hex"),
            });
            minerTags.delete(tokenHeight - 10);
        } catch (_) { }
    }
});

const waitForNextBlock = async () => {
    const block0 = state.bestBlockchainHeight;
    while (block0 === state.bestBlockchainHeight) {
        await sleep(20);
    }
    state.bestBlockchainHeight = state.bestBlockchainHeight;
    console.log(`Blockchain height: ${state.bestBlockchainHeight}`);
    console.log(`Maze token height: ${state.bestTokenHeight}`);
    minerTags.forEach((o) => o.conf++);
};

const processTxnList = async (txnDataList: GetMempoolResponse.TransactionData[]) => {
    for (const txnData of txnDataList) {
        const outputs = txnData.getTransaction()!.getOutputsList();
        let slpMsg: SlpTransactionDetails;

        try {
            slpMsg = slp.parseSlpOutputScript(Buffer.from(outputs[0].getPubkeyScript_asU8()))!;
        } catch (_) {
            continue;
        }

        if (slpMsg!.tokenIdHex === process.env.TOKEN_ID_V1 &&
            slpMsg.transactionType === SlpTransactionType.MINT) {
            const scriptSig = Buffer.from(txnData.getTransaction()!.getInputsList()[0].getSignatureScript_asU8());
            const scriptSigAsm = BITBOX.Script.toASM(scriptSig).split(" ");
            const lastTokenBlockBuf = Buffer.from(scriptSigAsm[0], "hex");
            if (lastTokenBlockBuf.length !== 4) {
                continue;
            }
            const lastTokenBlock = lastTokenBlockBuf.readInt32LE();
            if (lastTokenBlock > state.bestTokenHeight) {
                state.bestTokenHeight = lastTokenBlock;
                state.lastBatonTxid = Buffer.from(txnData.getTransaction()!.getHash_asU8().slice().reverse()).toString("hex");
            }

            // add miner tag
            minerTags.set(lastTokenBlock, {
                conf: txnData.getTransaction()!.getConfirmations(),
                tag: Buffer.from(scriptSigAsm[6], "hex").toString("utf-8"),
                txid: Buffer.from(txnData.getTransaction()!.getHash_asU8().slice().reverse()).toString("hex"),
            });
            minerTags.delete(lastTokenBlock - 10);
        }
    }
};

export const generateV1 = async () => {

    // clear list of txn ids persisted txn bufs
    ValidityCache.utxoIds.clear();

    state = JSON.parse(JSON.stringify(defaultState));
    state.bestBlockchainHeight = (await client.getBlockchainInfo()).getBestHeight();

    // scan blocks for MINT baton
    if (! state.lastBatonTxid) {
        let blockHeight = (await client.getBlockchainInfo()).getBestHeight();
        while (! state.lastBatonTxid) {
            // TODO: ...
            // state.bestBlockchainHeight = (await client.getBlockchainInfo()).getBestHeight();
            const block = await client.getBlock({ index: blockHeight, fullTransactions: true });
            await processTxnList(block.getBlock()!.getTransactionDataList());
            blockHeight--;
        }
    }

    // try to get best token block from mempool
    const mempool = await client.getRawMempool({ fullTransactions: true });
    await processTxnList(mempool.getTransactionDataList());

    // check to see if lastTxid is still unspent.
    if (state.lastBatonTxid) {
        try {
            await client.getUnspentOutput({
                hash: state.lastBatonTxid, vout: 2,
                reversedHashOrder: true, includeMempool: true });
        } catch (error) {
            console.log("Cannot find contract tip.");
            await sleep(1000);
            return;
        }
    }

    console.log(`Generate instatiated with a current token height of ${state.bestTokenHeight} and blockchain height of ${state.bestBlockchainHeight}.`);

    // pre-load slpjs validator from the persisted cache
    for (const [txid, validity] of ValidityCache.cachedValidity) {
        validator.cachedValidations[txid] = { validity } as Validation;
    }

    console.log(`Current baton location: ${state.lastBatonTxid}:2`);
    console.log(`Blockchain height: ${state.bestBlockchainHeight}`);

    console.log(`Reward txo: ${state.lastBatonTxid}:2`);

    // get miner's address unspent UTXOs
    console.log(`Getting unspent txos for ${minerBchAddress}`);
    const unspent = await client.getAddressUtxos({ address: minerBchAddress, includeMempool: true });
    const txos = unspent.getOutputsList().map((o) => {
        return {
            cashAddress: minerBchAddress,
            satoshis: o.getValue(),
            txid: Buffer.from(o.getOutpoint()!.getHash_asU8().slice().reverse()).toString("hex"),
            vout: o.getOutpoint()!.getIndex(),
            wif: process.env.WIF,
            scriptPubKey: Buffer.from(o.getPubkeyScript_asU8()).toString("hex"),
            txBuf: ValidityCache.txnCache.has(Buffer.from(o.getOutpoint()!.getHash_asU8().slice().reverse()).toString("hex")) ?
                    ValidityCache.txnCache.get(Buffer.from(o.getOutpoint()!.getHash_asU8().slice().reverse()).toString("hex")) :
                    null,
        } as SlpAddressUtxoResult;
    });
    console.log(`Completed fetching txos for ${minerBchAddress}`);

    // add current utxo txids to cache so that we store the txns in our persisted cache to speed up local validation
    // ValidityCache.utxoIds.clear();
    txos.forEach((txo) => ValidityCache.utxoIds.add(txo.txid));

    // validate and categorize unspent TXOs
    // @ts-ignore
    console.log(`Validating unspent SLP txos in miner's wallet...`);
    const utxos = await network.processUtxosForSlp(txos);
    console.log(`Finished validating SLP txos in miner's wallet.`);
    let txnInputs = utxos.nonSlpUtxos.filter((o: any) => o.satoshis >= 1870);
    if (txnInputs.length === 0) {
        throw Error("There are no non-SLP inputs available to pay for gas");
    }

    // verify actual t0 address matches our computed address
    const encodeAsHex = (n: number) => {
        return BITBOX.Script.encode([BITBOX.Script.encodeNumber(n)]).toString("hex");
    };
    const stateT0Buf = Buffer.alloc(4);
    stateT0Buf.writeInt32LE(state.bestTokenHeight, 0);
    const stateT0 = stateT0Buf.toString("hex");
    const initialMintAmount = encodeAsHex(parseInt(process.env.TOKEN_INIT_REWARD_V1 as string, 10));
    const difficultyLeadingZeroBytes = encodeAsHex(parseInt(process.env.MINER_DIFFICULTY_V1 as string, 10));
    const halvingInterval = encodeAsHex(parseInt(process.env.TOKEN_HALVING_INTERVAL_V1 as string, 10));
    const startingBlockHeight = encodeAsHex(parseInt(process.env.TOKEN_START_BLOCK_V1 as string, 10));
    const mintVaultHexT0 = `04${stateT0}20${process.env.TOKEN_ID_V1}${initialMintAmount}${difficultyLeadingZeroBytes}${halvingInterval}${startingBlockHeight}${vaultHexTail}`;

    const redeemScriptBufT0 = Buffer.from(mintVaultHexT0, "hex");
    const vaultHash160 = BITBOX.Crypto.hash160(redeemScriptBufT0);
    const vaultAddressT0 = Utils.slpAddressFromHash160(vaultHash160, "mainnet", "p2sh");
    console.log(`T0 redeemScript:\n${mintVaultHexT0}`);
    const scriptPubKeyHexT0 = "a914" + Buffer.from(bchaddr.decodeAddress(vaultAddressT0).hash).toString("hex") + "87";
    console.log(`T0 scriptPubKey:\n${scriptPubKeyHexT0}`);

    // if (mintVaultAddressT0 !== vaultAddressT0) {
    //     throw Error("Mismatch contract address for t0, unknown error.");
    // }

    // build t1 state
    const stateT1Buf = Buffer.alloc(4);
    stateT1Buf.writeInt32LE(state.bestTokenHeight + 1, 0);
    const stateT1 = stateT1Buf.toString("hex");

    // construct the t1 contract
    const mintVaultHexT1 = `04${stateT1}20${process.env.TOKEN_ID_V1}${initialMintAmount}${difficultyLeadingZeroBytes}${halvingInterval}${startingBlockHeight}${vaultHexTail}`;
    const redeemScriptBufT1 = Buffer.from(mintVaultHexT1, "hex");
    const vaultHash160T1 = BITBOX.Crypto.hash160(redeemScriptBufT1);
    const vaultAddressT1 = Utils.slpAddressFromHash160(vaultHash160T1, "mainnet", "p2sh");
    console.log(`T1 redeemScript:\n${mintVaultHexT1}`);
    const scriptPubKeyHexT1 = "a914" + Buffer.from(bchaddr.decodeAddress(vaultAddressT1).hash).toString("hex") + "87";
    console.log(`T1 scriptPubKey:\n${scriptPubKeyHexT1}`);

    // add p2sh baton input with scriptSig
    const txo = {
        txid: state.lastBatonTxid,
        vout: 2,
        satoshis: 546,
    };
    // @ts-ignore
    const baton = await network.processUtxosForSlp([txo]);

    // save true validations to cache
    for (const txid in validator.cachedValidations) {
        if (txid.length === 64 && typeof validator.cachedValidations[txid].validity === "boolean") {
            ValidityCache.cachedValidity.set(txid, validator.cachedValidations[txid].validity!);
        }
    }
    // save false validations to cache
    for (const [txid, _] of ValidityCache.txnCache) {
        if (! validator.cachedValidations[txid]) {
            ValidityCache.cachedValidity.set(txid, false);
        }
    }
    await ValidityCache.write();

    // select the inputs for transaction
    txnInputs = [ ...baton.slpBatonUtxos[process.env.TOKEN_ID_V1 as string], txnInputs[0] ];

    // construct the mint transaction preimage
    const extraFee = redeemScriptBufT0.length + 8 + 32 + 8 + 8 + 72 + 100;
    const rewardAmount = getRewardAmount(state.bestTokenHeight);

    // create a MINT Transaction
    let unsignedMintHex = txnHelpers.simpleTokenMint({
                                        tokenId: process.env.TOKEN_ID_V1!,
                                        mintAmount: new BigNumber(rewardAmount),
                                        inputUtxos: txnInputs,
                                        tokenReceiverAddress: minerSlpAddress,
                                        batonReceiverAddress: vaultAddressT1,
                                        changeReceiverAddress: minerSlpAddress,
                                        extraFee,
                                        disableBchChangeOutput: true,
                                        });

    // set nSequence to enable CLTV for all inputs, and set transaction Locktime
    unsignedMintHex = txnHelpers.enableInputsCLTV(unsignedMintHex);

    console.log(`Blockchain height: ${state.bestBlockchainHeight}`);
    console.log(`Maze height: ${state.bestTokenHeight}`);

    if (state.bestTokenHeight >= (state.bestBlockchainHeight - tokenStartBlock)) {
        console.log("Token height is synchronized with blockchain height, after solution is mined will wait for block before submitting solution.");
        unsignedMintHex = txnHelpers.setTxnLocktime(unsignedMintHex, state.bestBlockchainHeight + 1);
    } else {
        unsignedMintHex = txnHelpers.setTxnLocktime(unsignedMintHex, state.bestBlockchainHeight);
    }

    // Build scriptSig
    const batonTxo = baton.slpBatonUtxos[process.env.TOKEN_ID_V1!][0];
    const batonTxoInputIndex = 0;
    const sigObj = txnHelpers.get_transaction_sig_p2sh(
                                unsignedMintHex,
                                minerWif,
                                batonTxoInputIndex,
                                batonTxo.satoshis,
                                redeemScriptBufT0,
                                redeemScriptBufT0,
                                );

    const tx = Bitcore.Transaction.fromHex(unsignedMintHex);
    console.log(`Preimage:`);
    const scriptPreImage: Buffer = tx.sigHashPreimageBuf(0, redeemScriptBufT0, 546, 0x41);

    // mine for the solution
    const difficulty = parseInt(process.env.MINER_DIFFICULTY_V1 as string, 10);
    const prehash = Buffer.concat([scriptPreImage, crypto.randomBytes(4)]);
    let solhash = BITBOX.Crypto.hash256(prehash);

    console.log(`Mining height: ${state.bestTokenHeight + 1} (baton txid: ${state.lastBatonTxid})`);

    if (process.env.USE_FASTMINE === "yes") {
        let keepTrying = true;
        while (keepTrying) {
            // exit so we can try again
            if (state.bchdMintTxnSeen) {
                console.log("Miner exited early since token reward has been found.");
                return false;
            }
            console.log("Please wait, mining for Maze (using fastmine)...");
            const cmd = `${process.cwd()}/fastmine/fastmine ${scriptPreImage.toString("hex")} ${difficulty}`;
            const content =  await execute(cmd) as string;
            const lines = content.split("\n");
            if (lines.length === 0) {
                continue;
            }

            for (const line of lines) {
                if (line.split(" ")[0] !== "FOUND") {
                    console.log(line);
                    continue;
                }

                const bytes = Buffer.from(line.split(" ")[1], "hex");
                prehash[prehash.length - 4] = bytes[0];
                prehash[prehash.length - 3] = bytes[1];
                prehash[prehash.length - 2] = bytes[2];
                prehash[prehash.length - 1] = bytes[3];
                solhash = BITBOX.Crypto.hash256(prehash);

                if (solhash[0] !== 0x00 || solhash[1] !== 0x00 || solhash[2] !== 0x00) {
                    console.log("Something went wrong with fastmine");
                    continue;
                } else {
                    console.log("Found!");
                    keepTrying = false;
                    break;
                }
            }
        }
    } else {
        console.log("Please wait, mining for Maze (not using fastmine)...");

        let count = 0;
        while (!solhash.slice(0, difficulty).toString("hex").split("").every((s) => s === "0")) {
            prehash[0 + scriptPreImage.length] = Math.floor(Math.random() * 255);
            prehash[1 + scriptPreImage.length] = Math.floor(Math.random() * 255);
            prehash[2 + scriptPreImage.length] = Math.floor(Math.random() * 255);
            prehash[3 + scriptPreImage.length] = Math.floor(Math.random() * 255);
            solhash = BITBOX.Crypto.hash256(prehash);

            // we must sleep in order to allow sse async call to be processed
            count++;
            if (count % 100000 === 0) {
                await sleep(1);
                count = 0;
            }

            // check if mintFound flag set by sse
            if (state.bchdMintTxnSeen) {
                console.log(`Token reward has been found, solution forfeited for ${state.lastBatonTxid} (on bchd mint txn seen).`);
                return;
            }
        }
    }

    const mintAmountLE = Buffer.alloc(4);
    mintAmountLE.writeUInt32LE(rewardAmount, 0);

    const scriptSigsP2sh = {
        index: batonTxoInputIndex,
        lockingScriptBuf: redeemScriptBufT0,
        unlockingScriptBufArray: [
            stateT1Buf,
            prehash.slice(scriptPreImage.length),
            mintAmountLE,
            sigObj.signatureBuf,
            minerPubKey,
            scriptPreImage,
            Buffer.from(process.env.MINER_UTF8 as string, "utf8"),
        ],
    } as ScriptSigP2SH;

    // Build p2pkh scriptSigs
    txnInputs[1].wif = process.env.WIF as string;
    const scriptSigsP2pkh = txnHelpers.get_transaction_sig_p2pkh(
                                            unsignedMintHex,
                                            minerWif,
                                            1,
                                            txnInputs[1].satoshis,
                                            ) as ScriptSigP2PKH;

    const scriptSigs = [ scriptSigsP2sh, scriptSigsP2pkh ] as Array<ScriptSigP2PK|ScriptSigP2PKH|ScriptSigP2SH>;
    const signedTxn = txnHelpers.addScriptSigs(unsignedMintHex, scriptSigs);

    console.log(`scriptPubKeyHex T0:\n${scriptPubKeyHexT0}`);
    console.log(`redeem Script Buf T0:\n${redeemScriptBufT0.toString("hex")}`);

    console.log(`scriptPubKeyHex T1:\n${scriptPubKeyHexT1}`);
    console.log(`redeem Script Buf T1:\n${redeemScriptBufT1.toString("hex")}`);

    console.log(`solution embedded in this txn:\n${signedTxn}`);

    if (state.bestTokenHeight >= (state.bestBlockchainHeight - tokenStartBlock)) {
        console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        console.log(`Recent Miner Tags:`);
        minerTags.forEach((info, height) => {
            console.log(`height: ${height}, tx: ${info.txid}, conf: ${info.conf} ==> "${info.tag}"`);
        });
        console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        console.log(`Current baton location: ${state.lastBatonTxid}, height: ${state.bestTokenHeight}`);
        console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        console.log(`Token height is synchronized with blockchain height, waiting for next block ${state.bestBlockchainHeight + 1} to submit the mined token height ${state.bestTokenHeight + 1} solution...`);
        await waitForNextBlock();
    }

    // submit our solution to bchd
    try {
        const txres = await client.submitTransaction({txnHex: signedTxn});
        console.log(`Submitted solution in txid: ${state.lastBatonTxid} (via BCHD)`);
        return;
    } catch (error) {
        if (! (error as Error).message.includes("already spent by transaction") &&
            ! (error as Error).message.includes("tx rejected: orphan transaction")) {
            throw error;
        } else if ((error as Error).message.includes("has insufficient priority")) {
            throw Error("Transaction fee too low");
        } else {
            console.log(`BCHD submit failed: ${error.message}`);
        }
    }

    console.log(`Token reward has been found, solution forfeited for ${state.lastBatonTxid} (failed submit txn).`);
    return;
};
