### Mminer 1.0.2 

_Update and tutorial by [B_S_Z](https://t.me/b_s_z) - https://mazetoken.github.io_

You can create a mineable SLP tokens (based on Mist covenant contract script) and mine it with Mminer

Mminer is an updated version of Mist miner - bchd_mist_miner_v1 (https://mistcoin.org)

What is updated:

- Mminer is patched for "bn not an integer" error and "dust input attack" (the patch is from https://gitlab.com/blue_mist/miner)

- package.json - npm packages (e.g. slpjs 0.27.11)

- generateV1.ts - Mminer works with a modified* grpc-bchrpc-node 0.11.3 (https://github.com/simpleledgerinc)

_*SkipSlpValidityChecks is set to "true" and should be set to "false" when BCHD instances support SLP indexing)_

- NFT1-Group Token mining


Mminer is tested and it works, but use it at your own risk. If you are not sure about this miner, start with the original miner from https://mistcoin.org. The miner is not an "out of the box" application and may not be for everyone

Mminer is prepared for mining MAZE, but you can use it to mine other tokens and NFTs (scroll down to tokens environment and replace data in Mminer .env file)

#### IMPORTANT: for NFT1-Group Token mining you need to change the token environment (.env file) and after you run `npm i` and before you run `npm start`, go to node_modules folder in Mminer main directory, go to slpjs folder, go to lib folder and open slpjs.js (in editor, e.g. notepad) and change token type from `0x01` to `0x81` in line 423 (it should look like this: `if (type === void 0) { type = 0x81; }`)

--------------------------------------------------------------------------------

### Mining tutorial for beginners (Windows 10, Linux Ubuntu and Android phone)

You need to have some basic knowledge how to use Windows or Linux and a command line. This tutorial may not be for perfect (my english is not perfect, too), so use your intuition. It`s not tested on "fresh" Windows and you may need some other applications or drivers installed, that I`m not aware

_*You can also check [this](https://github.com/blockparty-sh/mist-miner) tutorial_

#### Prepare Electron Cash SLP desktop wallet for mining

- Download [Electron Cash SLP wallet](https://simpleledger.cash/project/electron-cash-slp-edition/)

- Create a standard wallet in Electron Cash. Go to Addresses tab and choose two addresses (one for funding and the second for mining; you can give them a label). You can also create two separate wallets - one for funding and the second for mining - it`s up to you

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

- Right click on your mining address and get your private key (WIF). Save it somewhere (you will need to paste it in the miner .env file)

_*Do not send other BCH to your mining address, otherwise you could pay high fee or you will not mine anything. Freeze your mining coins (select all 0.00001870 UTXOs and rigt click on it to freeze) before you send any tokens from your wallet to another wallet_


#### Mining on Windows 10

##### First method:

- Open Windows Control panel - go to "Programs" - go to "Turn Windows features on or off" - select "Windows Subsystem for Linux" and check the box, click ok and reboot Windows

- Download and install Ubuntu 20.4 LTS from Microsoft Store (type ubuntu in search bar)

- Open Ubuntu command line (Start menu - Ubuntu)

- Setup your username and password

- In a command line type commands (press enter after every command):

`cd /mnt/c`

`sudo apt update`

`sudo apt upgrade`

`sudo apt-get install git cmake gcc g++ make`

`git clone https://github.com/mazetoken/mminer.git`

`cd mminer`

`cd fastmine`

`cmake . && make`

`cd ..`

`npm i`

_*Ignore errors (if any appears). Do not run npm audit fix!_

Open windows explorer (no need to close Ubuntu command line) and go to mminer folder on your drive C. Click on mminer folder and you will see the miner files. Open .env file in notepad (or any other editor). Paste your WIF (your mining address private key) here "..." (WIF="..."). Leave BCHD_GRPC_URL="" and BCHD_GRPC_CERT="" blank (or paste BCHD_GRPC_URL="..." if you know any). You can type your mining tag (your nick or whatever) in MINER_UTF8="...". Save the file

Go back to Ubuntu command line and type command:

`npm start`

_*Txid will be downloaded first (it may take a while) and then mining will start_

_*Press Ctrl C if you want to stop the miner_


##### Second method:

- Make sure that Microsoft Visual C++ Redistributable is installed on your system. If it is not, you can download it from [here](https://aka.ms/vs/16/release/VC_redist.x86.exe) and [here](https://aka.ms/vs/16/release/VC_redist.x64.exe) - you need to install both

- Download and install [Nodejs](https://nodejs.org/en/)

- Download and install [Git](https://gitforwindows.org/)

- Open Windows PowerShell (press Windows key and X) and type commands (press enter after every command):

`cd ..`

`cd  ..`

`git clone https://github.com/mazetoken/mminer.git`

`cd mminer`

`npm i`

_*Ignore warnings (if any appears). Do not run npm audit fix !_

Open windows explorer (no need to close PowerShell) and go to mminer folder on your drive C. Click on mminer folder and you will see the miner files. Open .env file in notepad (or any other editor). Paste your WIF (your mining address private key) here "..." (WIF="..."). Leave BCHD_GRPC_URL="" and BCHD_GRPC_CERT="" blank (or paste BCHD_GRPC_URL="..." if you know any). You can type your mining tag (your nick or whatever) in MINER_UTF8="...". Save the file

Go back to PowerShell and type command:

`npm start`

_*Txid will be downloaded first (it may take a while) and then mining will start_

_*Press Ctrl C and type Y if you want to stop the the miner_


#### Mining on Android phone with Linux Ubuntu

_*You may need 2GB ram_

##### Go to Google Play Store and download UserLAnd app

- Install the app

- Open the app and install Ubuntu

- Setup your username and passwords

- Choose SSH

- In a command line type your password (it is invisible) and type or paste commands (one by one):

`sudo apt-get update && sudo apt-get dist-upgrade`

`sudo apt-get install git wget curl`

`curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -`

`sudo apt-get install -y nodejs`

`sudo npm install -g npm@7.0.6`

_*Ignore errors (if any appears). Do not run npm audit fix !__

`sudo apt-get install cmake gcc g++ make`

`sudo apt-get install nano zip unzip`

`git clone https://github.com/mazetoken/mminer.git`

`cd mminer`

`sudo nano .env`

_*Type/paste your WIF (your mining address private key) here "..." (WIF="...")_

_*Leave BCHD_GRPC_URL="" and BCHD_GRPC_CERT="" blank (or paste BCHD_GRPC_URL="..." if you know any)_

_*You can type your mining tag (your nick or whatever) in MINER_UTF8="..."_

_*You can set fastmine to "no" if you don't want to install CMake (below), but mining is faster if fastmine is set to "yes"_

_*Tap: ctrl O enter - to save changes and ctrl X enter - to exit editor_


##### Download CMake, but not to the mminer directory. We have  to do this because we need a new version of CMake for fastmine. Unfortunately, it will take some time - a few hours, so be patient. You can change the sleep time of your phone display to 30 minutes to make it a little bit faster. You can skip this if you do not want to mine with fastmine (set fastmine to "no" in Miner .env file)

Type commands:

`cd ..`

`sudo apt install build-essential libssl-dev`

`wget https://github.com/Kitware/CMake/releases/download/v3.18.4/cmake-3.18.4.tar.gz`

`tar -zxvf cmake-3.18.4.tar.gz`

`cd cmake-3.18.4`

`./bootstrap`

`make` 

`sudo make install`

`cd ..`

`cd mminer/fastmine`

`cmake . && make`

`cd ..`

##### Install and start the miner. Type commands:

`npm i`

_*Ignore errors. Do not run npm audit fix !_

`npm start`

_*Txid will be downloaded first (it may take a while) and then mining will start_

_*Javascript heap out of memory error may appear. You will need to setup and run the miner on desktop and download .cache file from mminer-main folder to mminer directory in your phone_

_*Tap Ctrl C (to stop the miner)_

Start the miner again (if you have closed UserLAnd app) - open the app, type your password and type commands:

`cd mminer`

`npm start`

--------------------------------------------------------------------------------------

##### NFT child tokens

To create NFT child tokens from mineable NFT1-Group tokens go to your Electron Cash SLP wallet, go to Tokens tab, rigt click on NFT token - create new NFT, choose a name and a symbol for your NFT child token (mined NFT1-Group token will be burned as each child token is created - minted). Before you start freeze your mining coins (all 0.00001870 UTXOs)

You do not need to mine NFT1-Group Token constantly. Mine a few blocks and create some NFT child tokens

Always send NFT to SLP NFT compatible wallets (e.g. Electron Cash wallet SLP edition or memo.cash browser wallet)

_"1. An NFT 'Group' token is created first. This is not an NFT itself, but the raw ingredient from which an NFT is created. This is analogous to a stem cell, which is a cell that has not yet chosen to be a specific type of cell (like bone, blood, or nerve cell), but has the potential to become any of them._

_2. NFT Group tokens can be created, minted, and sent just like any other kind of SLP token. The reason these are called a 'Group' token is that they represent a class or group of NFTs. So a Group might represent a class of items like swords, paintings, or concert tickets._

_3. A NFT Child token is generated by consuming an NFT Group token. NFT Children are the actual NFT tokens and represent specific things with that class, like Excalibur (a sword), the Mona Lisa (a painting), and Row B seat 24 (a concert ticket)._

_4. NFT Children can be created and sent, but they can not be minted like other SLP tokens."*_

*This NFT description above (1-4) is from [PSF](https://github.com/Permissionless-Software-Foundation/bch-js-examples/tree/master/applications/slp/nft)  

--------------------------------------------------------------------------------------

#### If you need any help, ask in Maze Community [Group](https://t.me/mazemining)

--------------------------------------------------------------------------------------

#### Maze and other mineable tokens environment (inculding Non-Fungible Tokens)

_*There will be eight halving events for SLP Token Type 1. Total supply will not be higher than 21 million_

_*NFT1-Group Token mining will probably stop at third halving (reward reduction) because of 0 decimal places_

_*Change data in Mminer .env file to mine different tokens_

_*Do not paste MINER_COVENANT_V1 from SLP Token Type 1 to NFT1-Group Token_

_*Do not forget that, for NFT1-Group Token mining, after you run `npm i` and before you run `npm start`, you should go to node_modules folder in Mminer directory, go to slpjs folder, go to lib folder and open slpjs.js (in editor, e.g. notepad) and change token type from `0x01` to `0x81` in line 423 (it should look like this: `if (type === void 0) { type = 0x81; }`)_

_*I recommend using different addressess (WIFs) for different tokens (but it`s not necessary). Make a backup of .cache file from time to time (to prevent downloading a lot of txids if you reinstall the miner or run it on another pc/laptop/phone)_


##### Maze (MAZE is the second mineable SLP Token Type 1):

```
TOKEN_INIT_REWARD_V1=800000000
TOKEN_HALVING_INTERVAL_V1=4320
MINER_DIFFICULTY_V1=3
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
25920-30239 | 114,292929
30240-34559 | 100
34560< | ...`
```

##### Maze NFT1-Group Token (MAZE NFT is the first mineable NFT):

```
TOKEN_INIT_REWARD_V1=20
TOKEN_HALVING_INTERVAL_V1=21600
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000181044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
MINER_DIFFICULTY_V1=3
TOKEN_START_BLOCK_V1=661499
TOKEN_ID_V1="8678ad8c66cdcbdbb6e8f610fda055458b096c0f09a7fb6a18fe098343411f21"
USE_FASTMINE="yes"
```


##### BHACK - Blind Hackers Group (Maze Universe). 500000 BHACK is "pre-mined" (minted)

```
TOKEN_INIT_REWARD_V1=10000000
TOKEN_HALVING_INTERVAL_V1=4320
MINER_DIFFICULTY_V1=3
TOKEN_START_BLOCK_V1=667287
TOKEN_ID_V1="bc3ab6616aecd03ecbff478c882e05df043e8af959f3c3964c9c9d15ba7d55bd"
USE_FASTMINE="yes"
```


##### BHACK NFT1-Group Token (coming soon):

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000181044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=
TOKEN_HALVING_INTERVAL_V1=
MINER_DIFFICULTY_V1=3
TOKEN_START_BLOCK_V1=
TOKEN_ID_V1=""
USE_FASTMINE="yes"
```


##### Mist (Mist is the first mineable SLP Token Type 1, created by Kasumi):

```
TOKEN_INIT_REWARD_V1=400000000
TOKEN_HALVING_INTERVAL_V1=4320
MINER_DIFFICULTY_V1=3
TOKEN_START_BLOCK_V1=639179
TOKEN_ID_V1="d6876f0fce603be43f15d34348bb1de1a8d688e1152596543da033a060cff798"
USE_FASTMINE="yes"
```


##### dSLP (decentralized SLP) - an universal SLP Token Type 1:

```
TOKEN_INIT_REWARD_V1=2000000
TOKEN_HALVING_INTERVAL_V1=6480
MINER_DIFFICULTY_V1=2
TOKEN_START_BLOCK_V1=653104
TOKEN_ID_V1="5aa6c9485f746cddfb222cba6e215ab2b2d1a02f3c2506774b570ed40c1206e8"
USE_FASTMINE="yes"
```
_*To enable fastmine for dSLP go to Mminer src folder, open generateV1.ts in any editor, go to line 443 and remove `|| solhash[2] !== 0x00`. It should look like this: `if (solhash[0] !== 0x00 || solhash[1] !== 0x00) {`_

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


##### dSLP NFT1-Group Token (coming soon):

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000181044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=
TOKEN_HALVING_INTERVAL_V1=
MINER_DIFFICULTY_V1=3
TOKEN_START_BLOCK_V1=
TOKEN_ID_V1=""
USE_FASTMINE="yes"
```


##### ARENA NFT1-Group Token:

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000181044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=10
TOKEN_HALVING_INTERVAL_V1=25920
MINER_DIFFICULTY_V1=3
TOKEN_START_BLOCK_V1=665753
TOKEN_ID_V1="9cc03f37c27ec0334b839f1ed66e07da13ff19d29a497ebbf505e124453831fd"
USE_FASTMINE="yes"
```


##### ZOMBIE NFT1-Group Token:

```
MINER_COVENANT_V1="5779820128947f777601207f75597982012c947f757601687f777678827758947f7576538b7f77765c7982777f011179011179ad011179828c7f756079a8011279bb011479815e7981788c88765b79968b0114795e795279965480880400000000011579bc7e0112790117797eaa765f797f757681008854011a797e56797e170000000000000000396a04534c50000181044d494e54200113797e030102087e54797e0c22020000000000001976a914011879a97e0288ac7e0b220200000000000017a9145379a97e01877e527952797e787eaa607988587901127993b175516b6d6d6d6d6d6d6d6d6d6d6d6d6d6d6d6c"
TOKEN_INIT_REWARD_V1=10
TOKEN_HALVING_INTERVAL_V1=25920
MINER_DIFFICULTY_V1=3
TOKEN_START_BLOCK_V1=662762
TOKEN_ID_V1="de6339df4ea6ff1b999c3c16b16764f3f749817d8a160a1cac29a1171f7ad639"
USE_FASTMINE="yes"
```

--------------------------------------------------------------------------------------------


