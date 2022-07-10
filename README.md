### MAZE - a mineable (proof-of-work) Bitcoin Cash Simple Ledger Protocol token

Get [Mminer 1.0.3](https://github.com/mazetoken/mminer) from Github

_Tutorial by B_S_Z - https://mazetoken.github.io_

MAZE token id: [bb553ac2ac7af0fcd4f24f9dfacc7f925bfb1446c6e18c7966db95a8d50fb378](https://simpleledger.info/token/bb553ac2ac7af0fcd4f24f9dfacc7f925bfb1446c6e18c7966db95a8d50fb378)

#### Mminer is prepared for mining MAZE, but you can mine Mist (scroll down for Mist minig environment to use in .env) and other tokens with Mminer and create mineable SLP tokens based on Mistcoin covenant contract script

Mminer is continuation of [Mistcoin BCHD mist-miner](Mistcoin-archive/bchd_mist_miner_v1.zip) by [Kasumi](https://read.cash/@kasumi). Mistcoin website (https://mistcoin.org) is down, so you can check [Mistcoin Archive](Mistcoin-archive/Mistcoin.md). Check other miners in [Mistcoin archive](Mistcoin-archive/readme.md). You can swap Mist SLP token to Mist SmartBCH SEP20 token on [Mistylake](https://lake.mistswap.fi/). Visit [Mist on SmartBCH](https://mistswap.fi)

What is updated in the Mminer:

- Mminer is patched for "bn not an integer" error and "dust input attack", and stucked reward reduction (patches are from [Blue`s mist miner](https://gitlab.com/blue_mist/miner))

- package.json - npm packages (inculding grpc-bchrpc-node v 0.11.5 - works with BCHD nodes that have slp indexing enabled)

- BCHD gRPC slp validation is added (https://slp.dev)

- Mminer does not stop on halvening

_Scroll down for a short decription how to run Mminer with BCHD full node (optional)_

Mminer is tested and it works, but use it at your own risk. The miner is not an "out of the box" application (other software must be installed to run the miner)

Mminer is prepared for mining MAZE, but you can use it to mine other tokens (e.g. Mist) and NFTs (scroll down to tokens environment and replace data in Mminer .env file). You can change mineable token name in the generateV1.ts in the line 476 (default is Maze)

#### IMPORTANT: for NFT1-Group Token mining you need to change the token environment (.env file) and after you run `npm i` and before you run `npm start`, go to node_modules folder in Mminer main directory, go to slpjs folder, go to lib folder and open slpjs.js (in editor, e.g. notepad) and change token type from `0x01` to `0x81` in line 423 (it should look like this: `if (type === void 0) { type = 0x81; }`). Do not paste MINER_COVENANT_V1 from SLP Token Type 1 to NFT1-Group Token environment (in .env)

Known public BCHD servers you can use for mining: 

```
bchd.greyh.at:8335
bchd.imaginary.cash:8335
```

--------------------------------------------------------------------------------

### Mining tutorial (Debian or Ubuntu Linux subsystem on Windows 10, Windows 10 or Debian Linux subsystem on Android phone)

#### Prepare wallets for mining

- Download [Electron Cash SLP wallet](https://github.com/simpleledger/Electron-Cash-SLP/releases) - download 3.6.7-dev8 release

- Create a standard wallet in Electron Cash. Go to Addresses tab and choose two addresses (one for funding and the second for mining; you can give them a label). Right click on mining address and get the private key (WIF). Save it somewhere (you will need to paste it in the miner .env file)

- Send some BCH (e.g. 0.00020000) to your funding address

- From your funding address send, to your mining address, multiple 0.00001870 BCH in one transanction (go to Send tab - Pay to field). It should look like this:

```
simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn,0.00001870
simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn,0.00001870
simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn,0.00001870
simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn,0.00001870
simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn,0.00001870
simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn,0.00001870
simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn,0.00001870
simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn,0.00001870
simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn,0.00001870
simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn,0.00001870
```

_*Replace simpleledger:qzfl7rg2vc973hk8cp4e6jvcw2ku7fuvxgar8lansn with your own mining address. You can send more UTXOs later._

_Aternatively use Fullstack.cash wallet for mining (if EC SLP validation does not work) - create [Fullstack.cash wallet](https:wallet.fullstack.cash) - use it for mining only. Get a private key (WIF) from fullstack.cash wallet. Save it somewhere (you will need to paste it in the miner .env file)


#### Install Nodejs and other sofware

- Make sure that Microsoft Visual C++ Redistributable is installed on your system. If it is not, you can download it from [here](https://aka.ms/vs/16/release/VC_redist.x86.exe) and [here](https://aka.ms/vs/16/release/VC_redist.x64.exe) - you need to install both

- Download and install [Nodejs 14.x LTS](https://nodejs.org/en/) with additional software when asked

_You should see that e.g. visualstudio2017 build tools, python 3, chocolatey ... is being installed. Newer version of Nodejs might not work wih Mminer on windows, but works on linux_

- Download and install [Git](https://gitforwindows.org/)


#### Mining on Windows 10

##### First method:

- Open Windows Control panel - go to "Programs" - go to "Turn Windows features on or off" - select "Windows Subsystem for Linux" and check the box, click ok and reboot Windows

- Download and install Debian Linux or Ubuntu 20.4 LTS from Microsoft Store

- Open Linux command line (Start menu - Debian or Ubuntu)

- Setup your username and password

- In a command line type commands (press enter after every command; commands are the same for Debian or Ubuntu Linux):

`cd /mnt/c`

`sudo apt update`

`sudo apt upgrade`

`sudo apt-get install wget curl`

`curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -`

`sudo apt-get install -y nodejs`

`sudo apt-get install git cmake gcc g++ make`

`git clone https://github.com/mazetoken/mminer.git`

`cd mminer`

`cd fastmine`

`cmake . && make`

`cd ..`

`npm i`

_* Ignore errors/warnings (if any appears eg. keccak and secp256k1). Do not run npm audit fix!

Open windows explorer (no need to close a command line) and go to mminer folder on your drive C. Click on mminer folder and you will see the miner files. Open .env file in notepad (or any other editor). Paste your WIF (your mining address private key) here "..." (WIF="..."). Leave BCHD_GRPC_URL="" and BCHD_GRPC_CERT="" empty / no url (or paste known url in BCHD_GRPC_URL="..."). You can type your mining tag (your nick or whatever) in MINER_UTF8="...". Save the file

Go back to the command line and type commands (usually you need to do this only once to download txids):

`export NODE_OPTIONS=--max_old_space_size=4096` (for 4GB RAM)

or `export NODE_OPTIONS=--max_old_space_size=8192` (for 8GB RAM)

_You can calculate max old space for your RAM amount - 1024 x your RAM_

_* You can use Mminer`s .cache file: type/paste this command: `wget https://github.com/mazetoken/mminer/raw/master/txid-cache/maze/.cache` or this for Mist: `wget https://github.com/mazetoken/mminer/raw/master/txid-cache/mist/.cache`_

`npm start`

_* Txids will be downloaded first (it may take a while) and then mining will start_

_* Press Ctrl C if you want to stop the miner. Type `npm start` to start again_

_* Run command: `sudo apt update` from time to time to update Linux_


##### Second method:

- Open Windows PowerShell (press Windows key and X) and type commands (press enter after every command):

`cd ..`

`cd  ..`

`git clone https://github.com/mazetoken/mminer.git`

`cd mminer`

`npm i`

_*Ignore errors/warnings (if any eg. keccak and secp256k1). Do not run npm audit fix !

Open windows explorer (no need to close PowerShell) and go to mminer folder on your drive C. Click on mminer folder and you will see the miner files. Open .env file in notepad (or any other editor). Paste your WIF (your mining address private key) here "..." (WIF="..."). Leave BCHD_GRPC_URL="" and BCHD_GRPC_CERT="" empty /no url (or paste known url in BCHD_GRPC_URL="..."). You can type your mining tag (your nick or whatever) in MINER_UTF8="...". Save the file

Go back to PowerShell and type commands (usually you need to do this only once to download txids):

`$env:NODE_OPTIONS="--max-old-space-size=4096"` (for 4GB RAM)

or `$env:NODE_OPTIONS="--max-old-space-size=8192"` (for 8GB RAM)

_You can calculate max old space for your RAM amount - 1024 x your RAM_

_* You can use Mminer`s .cache file: copy .cache from txid-cache/Maze (or Mist) to main Mminer directory_

`npm start`

_* Txids will be downloaded first (it may take a while) and then mining will start_

_* Press Ctrl C and type Y if you want to stop the the miner_


#### Mining on Android phone with Debian Linux

_* You need at least 2GB RAM_

##### Go to Google Play Store and download UserLAnd app

- Install the app

- Open the app and install Debian Linux (not Ubuntu - fastmine does not work well with Ubuntu on Android)

- Setup your username and passwords (use a short username and password - e.g. 54321 - you can change the password later when you get used to Linux)

- Choose SSH

- change password if asked (can be the same password e.g. 54321 ;-) 

- In a command line type your password (it is invisible) and when you are in, type or paste commands (one by one, tap enter after every command, type Y when asked; you can open the tutorial in your browser to make it easier):

`sudo apt update`

`sudo apt upgrade`

`sudo apt-get install git wget curl`

`curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -`

`sudo apt-get install -y nodejs`

`sudo apt-get install cmake gcc g++ make`

`sudo apt-get install nano zip unzip`

`git clone https://github.com/mazetoken/mminer.git`

`cd mminer`

`cd fastmine`

`cmake . && make`

`cd ..`

`sudo nano .env`

_* Type/paste your WIF (your mining address private key) here "..." (WIF="...")_

_* Leave BCHD_GRPC_URL="" and BCHD_GRPC_CERT="" empty/no url (or paste known BCHD url in BCHD_GRPC_URL="...")_

_* You can type your mining tag (your nick or whatever) in MINER_UTF8="..."_

_* Tap: ctrl O enter - to save changes and ctrl X enter - to exit editor_

`npm i`

_* Ignore errors/warnings (if any appears eg. keccak and secp256k1). Do not run npm audit fix !


`export NODE_OPTIONS=--max_old_space_size=2048` (for 2GB RAM)

or `export NODE_OPTIONS=--max_old_space_size=4096` (for 4GB RAM)

_* usually you need to do this ^ only once to download txids (but it might not work on Android). You can calculate max old space for your RAM amount - 1024 x your RAM_

`npm start`

_* Txids will be downloaded first (it may take a while) and then mining will start. If you get Javasrcipt heap out of memory error or txids downloading is "killed", you may need to install the miner on desktop first and download .cache file to your phone miner directory (you can use `wget` command). You can use Mminer`s .cache file: before `npm start` type/paste this command: `wget https://github.com/mazetoken/mining/raw/master/txid-cache/maze/.cache` or this for Mist: `wget https://github.com/mazetoken/mining/raw/master/txid-cache/mist/.cache`_

_* Tap Ctrl C (to stop the miner)_

Start the miner again (if you closed UserLAnd app) - open the app, type your password and type commands:

`cd mminer`

`npm start`

_* Run command: `sudo apt update` from time to time to update Linux_

--------------------------------------------------------------------------------------

### How to create a mineable token based on Mistcoin (Mist) covenant contract (it might not work anymore because of slpdb does not work anymore)

Open Electron Cash SLP wallet, go to Tokens tab and right click to create a token. Your mineable token can have max 6 decimal places (you will need to remember decimal places to calculate mining reward amount). In Token Quantity filed type 0. Uncheck Fixed supply

Wait for confirmation. Right click on your token - view token details - viewTX. Copy the token id and start block (it is under token id - "Mined in block: ...")

Download and unzip this [Mist miner](Mistcoin-archive/mist_miner_0.0.2.zip) - we need slpdb miner to mine first "block"

Go to slp-mist-master folder and open .env file (e.g. in notepad):

```
SLPDB_URL="https://slpdb.fountainhead.cash/q/"
SLPSOCKET_URL="https://slpsocket.fountainhead.cash/s/"
WIF="" // you will paste your WIF here later
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000101044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c" //do not change this (this is the covenant contract template)
TOKEN_INIT_REWARD_V1=400000000 // Mist reward is 400 (with 6 decimals); you can change mining reward e.g. 10000000 - this is 1000 with 4 decimal places
TOKEN_HALVING_INTERVAL_V1=4320 // you can change halving interval
MINER_DIFFICULTY_V1=3 // do not change this
MINER_UTF8="" // you can add your mining tag
TOKEN_START_BLOCK_V1=paste here your token start block
TOKEN_ID_V1="paste here your token id"
``` 

Check Mining tutorial above if you have Nodejs and other software installed. Open a command line (PowerShell or Linux terminal) and navigate to slp-mist-master directory

Run commands:

```
npm i
npm run tsc
node ./src/init
```

You will get someting like this:

`Send baton here to create mining vault -> simpleledger:pzhtrhzfzut7ycsf7eh7j0y250sxfnjxr5v6aecgqv`

Go back to Electron Cash SLP wallet and right click on the token you created. Click on Mint tool. In Additional Token Quantity field type 0. Paste the mining vault slp address (that you generated with `node ./src/init` command) to Token Receiver Address and Mint Baton Address fields and click Create Additional Tokens. Your token minting baton will be sent to the contract address. Wait for confirmation

Choose a slp address where you get you mineable token. Right click on the address - Private key, copy it (it begins with L or K) - this is your WIF. Paste it to .env file in slp-mist-master. Send to this slp address multiple `0.00001870` BCH, as it is described in mining tutorial above

Go back to the command line and run:

`npm start`

Mining will start. After a while you should get your first "block" reward. When you get the first reward (mining height is 2) you can mine your token with BCHD miner (Mminer)

--------------------------------------------------------------------------------------

#### SLP NFT mining (mineable Non-Fungible Tokens)

You do not need to mine NFT1-Group Tokens constantly. Mine a few blocks and create some NFT child tokens

Always send NFTs to SLP NFT compatible wallets (e.g. Electron Cash wallet SLP edition, Signup wallet, Zapit wallet or Memo.cash browser wallet)

To create NFT child tokens from mineable NFT1-Group tokens go to your Electron Cash SLP wallet, go to Tokens tab, rigt click on NFT token - create new NFT (you might need to split it first), choose a name and a symbol for your NFT child token (NFT Group token will be burned as each child token is created - minted). Before you start freeze your mining coins (all 0.00001870 UTXOs)

--------------------------------------------------------------------------------------

#### If you need any help, ask in MAZE [Telegram Group](https://t.me/mazetokens)

--------------------------------------------------------------------------------------

#### Maze and other mineable tokens environment (inculding Non-Fungible Tokens)

_* Total supply will not be higher than 21 million_

_* NFT1-Group Token mining will probably stop at third halving (reward reduction) because of 0 decimal places_

_* Change data in Mminer .env file to mine different tokens_

_* Do not paste MINER_COVENANT_V1 from SLP Token Type 1 to NFT1-Group Token environment (.env)_

_* Do not forget that, for NFT1-Group Token mining, after you run `npm i` and before you run `npm start`, you should go to node_modules folder in Mminer directory, go to slpjs folder, go to lib folder and open slpjs.js (in editor, e.g. notepad) and change token type from `0x01` to `0x81` in line 423 (it should look like this: `if (type === void 0) { type = 0x81; }`)_

- It is possible to use one Mminer to mine a few tokens, but it is not recommended (because of a lot of txids to downolad)

- If a token is not mined for a long time it may be stucked in the blockchain. We can fix it

_* Make a backup of .cache file from time to time (to prevent downloading a lot of txids if you reinstall the miner or run it on another pc/laptop/phone)_


##### Maze (MAZE is the second mineable SLP Token Type 1):

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000101044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=800000000
TOKEN_HALVING_INTERVAL_V1=4320
MINER_DIFFICULTY_V1=3
MINER_UTF8=""
TOKEN_START_BLOCK_V1=645065
TOKEN_ID_V1="bb553ac2ac7af0fcd4f24f9dfacc7f925bfb1446c6e18c7966db95a8d50fb378"
USE_FASTMINE="yes"
```

Maze reward schedule:

Token Height | Maze Reward

```
1-4319 | 800
4320-8639 | 400
8640-12959 | 266,666666
12960-17279 | 200
17280-21599 | 160
21600-25919 | 133,333333
25920-30239 | 114,285714
30240-34559 | 100
34560< | ...`
```


##### Mist (Mistcoin) - the first mineable SLP Token Type 1:

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000101044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=400000000
TOKEN_HALVING_INTERVAL_V1=4320
MINER_DIFFICULTY_V1=3
MINER_UTF8=""
TOKEN_START_BLOCK_V1=639179
TOKEN_ID_V1="d6876f0fce603be43f15d34348bb1de1a8d688e1152596543da033a060cff798"
USE_FASTMINE="yes"
```

##### dSLP (decentralized SLP) - an universal SLP Token Type 1:

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000101044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=2000000
TOKEN_HALVING_INTERVAL_V1=6480
MINER_DIFFICULTY_V1=2
MINER_UTF8=""
TOKEN_START_BLOCK_V1=653104
TOKEN_ID_V1="5aa6c9485f746cddfb222cba6e215ab2b2d1a02f3c2506774b570ed40c1206e8"
USE_FASTMINE="yes"
```
_*To enable fastmine for dSLP go to Mminer src folder, open generateV1.ts in any editor, uncomment (remove //) from the line 499 and add comment (//) to the line 497. It should look like this: `if (solhash[0] !== 0x00 || solhash[1] !== 0x00) {`_

dSLP reward schedule:

Token Height | dSLP Reward

```
1-6479 | 200 dSLP
6480-12959 | 100
12960-19439 | 66,6666
19440-25919 | 50
25920-32399 | 40
32400-38879 | 33,3232
38880-45359 | 25,5555
45360-51839 | 25
51840< | ...`
```

##### BHACK - Blind Hackers Group

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000101044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=10000000
TOKEN_HALVING_INTERVAL_V1=4320
MINER_DIFFICULTY_V1=3
MINER_UTF8=""
TOKEN_START_BLOCK_V1=667287
TOKEN_ID_V1="bc3ab6616aecd03ecbff478c882e05df043e8af959f3c3964c9c9d15ba7d55bd"
USE_FASTMINE="yes"
```

##### Labyrinth - NFT1-Group Token

##### Maze-NFT - NFT1-Group Token (Labyrinth and MAZE NFT are the first mineable SLP NFT1-Group Tokens):

```
TOKEN_INIT_REWARD_V1=20
TOKEN_HALVING_INTERVAL_V1=21600
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000181044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
MINER_DIFFICULTY_V1=3
MINER_UTF8=""
TOKEN_START_BLOCK_V1=661499
TOKEN_ID_V1="8678ad8c66cdcbdbb6e8f610fda055458b096c0f09a7fb6a18fe098343411f21"
USE_FASTMINE="yes"
```

##### ZOMBIE NFT1-Group Token (https://zombies.onuniverse.com):

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000181044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=10
TOKEN_HALVING_INTERVAL_V1=25920
MINER_DIFFICULTY_V1=3
MINER_UTF8=""
TOKEN_START_BLOCK_V1=662762
TOKEN_ID_V1="de6339df4ea6ff1b999c3c16b16764f3f749817d8a160a1cac29a1171f7ad639"
USE_FASTMINE="yes"
```

##### MISTY (Mistcoin) - NFT1-Group Token (a Tribute to Kasumi - Mist creator):

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000181044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=400
TOKEN_HALVING_INTERVAL_V1=4320
MINER_DIFFICULTY_V1=3
MINER_UTF8=""
TOKEN_START_BLOCK_V1=669633
TOKEN_ID_V1="e715d16883317deb9894735fba035b5a4cb3b006344d6f0c151694886cedac32"
USE_FASTMINE="yes"
```

##### ARENA NFT1-Group Token:

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000181044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=10
TOKEN_HALVING_INTERVAL_V1=25920
MINER_DIFFICULTY_V1=3
MINER_UTF8=""
TOKEN_START_BLOCK_V1=665753
TOKEN_ID_V1="9cc03f37c27ec0334b839f1ed66e07da13ff19d29a497ebbf505e124453831fd"
USE_FASTMINE="yes"
```

_Other known mineable SLP Tokens Type 1: OPAL, BTCL, FILS, WRS, FANTASY - ask token creators for mining environment or check details below_

FILS (https://digitalfils.com):

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000101044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=600000000
TOKEN_HALVING_INTERVAL_V1=4320
MINER_DIFFICULTY_V1=3
MINER_UTF8=""
TOKEN_START_BLOCK_V1=678724
TOKEN_ID_V1="a7af0ffe54a50b7777a27d7ad3c9d077f710a3bec89a6b5eb4425023a546d5b0"
USE_FASTMINE="yes"
```

FANTASY (https://fantasytoken.cash):

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000101044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=700000000
TOKEN_HALVING_INTERVAL_V1=4320
MINER_DIFFICULTY_V1=3
MINER_UTF8=""
TOKEN_START_BLOCK_V1=683859
TOKEN_ID_V1="8d1731c60d3513fa06c87e14ce0f89b5b25d6fc843253212adb579b650bd93b7"
USE_FASTMINE="yes"
```

##### BCHD full node

Download and unzip [BCHD node installer](https://bchd.cash/) e.g. to drive C (C:/bchdnode)

Download and install [Go](https://golang.org/) for Windows

Open PowerShell, navigate to bchdnode directory and run command: `./bchd` 

In a few seconds stop it: `Ctrl+C`

Go to C:/bchdnode and edit bchd.conf (example is in the Mminer folder - sample-bchd.conf) - remove comment from addrindex, txindex and slpindex, add grpclisten=127.0.0.1)

Go back to PowerShell and run command `/.bchd` again

Sync the node (about 250 GB)

Edit .env file in the Mminer:

- remove comment from `BCHD_GRPC_URL="127.0.0.1:8335"` and from `BCHD_GRPC_CERT="C:\Users\Username\AppData\Local\Bchd\rpc.cert"`. Change Username for your Windows username

- add comment to other BCHD_GRPC_URL and BCHD_GRPC_CERT="")

Open another PowerShell, navigate to Mminer directory and run command: `npm start`


--------------------------------------------------------------------------------------------


