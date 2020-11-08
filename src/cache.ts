import fs from "fs";
import { Crypto } from "slpjs";

type txid = string;

const protons = require("protons");
const pb = protons(`
    syntax = "proto3";
    message PersistedCache {
        uint32 cacheVersion = 1;
        repeated bytes validTxids = 2;
        repeated bytes invalidTxids = 3;
        repeated bytes txnCache = 4;
    }
`);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface PbPersistedCache {
    cacheVersion: number;
    validTxids: Buffer[];
    invalidTxids: Buffer[];
}

class PersistedValidationCache {
    public static Instance() {
        return this._instance || (this._instance = new PersistedValidationCache());
    }

    private static _instance: PersistedValidationCache;

    public txnCache = new Map<txid, Buffer>();
    public utxoIds = new Set<txid>();
    public cachedValidity = new Map<txid, boolean>();

    constructor() {
        let file: Buffer;
        try {
            fs.writeFileSync(".cache_lock", Buffer.from([0]));
            file = fs.readFileSync(".cache");
        } catch (_) {
            return;
        } finally {
            try {
                fs.unlinkSync(".cache_lock");
            } catch (_) { }
        }
        const validTxids = pb.PersistedCache.decode(file).getValidTxids() as Buffer[];
        if (validTxids) {
            for (const txidBuf of validTxids) {
                this.cachedValidity.set(txidBuf.toString("hex"), true);
            }
        }
        const invalidTxids = pb.PersistedCache.decode(file).getInvalidTxids() as Buffer[];
        if (invalidTxids) {
            for (const txidBuf of invalidTxids) {
                this.cachedValidity.set(txidBuf.toString("hex"), false);
            }
        }
        const txns = pb.PersistedCache.decode(file).getTxnCache() as Buffer[];
        if (this.txnCache) {
            for (const txnBuf of txns) {
                const txid = Crypto.txid(txnBuf).toString("hex");
                this.txnCache.set(txid, txnBuf);
            }
        }
    }

    public async write() {
        const pbuf = pb.PersistedCache.encode({
            cacheVersion: 1,
            validTxids: Array.from(PersistedValidationCache.Instance().cachedValidity)
                                .filter((validity) => validity[1] === true)
                                .map((validity) => Buffer.from(validity[0], "hex")),
            invalidTxids: Array.from(PersistedValidationCache.Instance().cachedValidity)
                                .filter((validity) => validity[1] === false)
                                .map((validity) => Buffer.from(validity[0], "hex")),
            txnCache: Array.from(PersistedValidationCache.Instance().txnCache)  // We only want to store the txns in our UTXO set
                                .filter((txn) => PersistedValidationCache.Instance()
                                        .utxoIds.has(txn[0]) ? true : false)
                                .map((txn) => txn[1]),
        } as PbPersistedCache);
        if (fs.existsSync(".cache_lock")) {
            while (fs.existsSync(".cache_lock")) {
                await sleep(100);
            }
        }
        try {
            fs.writeFileSync(".cache_lock", Buffer.from([0]));
            try {
                fs.unlinkSync(".cache");
            } catch (_) { }
            fs.writeFileSync(".cache", pbuf);
        } catch (error) {
            throw error;
        } finally {
            try {
                fs.unlinkSync(".cache_lock");
            } catch (_) { }
        }
    }
}

export const ValidityCache = PersistedValidationCache.Instance();
