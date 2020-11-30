### Mminer 1.0.1 

_Update and tutorial by [B_S_Z](https://t.me/b_s_z)_

You can create a mineable SLP token (based on Mist covenant contract script) and mine it with Mminer

Mminer is an updated version of Mist miner - bchd_mist_miner_v1 (https://mistcoin.org)

What is updated:

- Mminer is patched for BigNumber error and dust input attack (the patch is from https://gitlab.com/blue_mist/miner)

- package.json - npm packages

- generateV1.ts - Mminer works with slpjs 0.27.8 and grpc-bchrpc-node 0.11.3 (https://github.com/simpleledgerinc)

_*SkipSlpValidityChecks is set to "true" and should be set to "false" when BCHD instances support SLP indexing)_

Mminer is tested and it works, but use it at your own risk

--------------------------------------------------------------------------------

### Mining tutorial

#### Prepare Electron Cash SLP desktop wallet for mining

- Download [Electron Cash SLP wallet](https://simpleledger.cash/project/electron-cash-slp-edition/)

- Create two wallets in Electron Cash, e.g. wallet_1 (mining wallet) and wallet_2 (funding wallet)

_*You can use only one wallet with two addresses (one for mining and one for funding), but you will have to be careful when funding your mining address or withdrawing - you will need to freeze your mining coins in the mining address each time you interact with funding address_

- Open wallet_2 (funding wallet), choose an address and send some BCH (e.g. 0.00025000) to this address

- Open wallet_1 (mining wallet), choose a mining address for your mining coins (0.00001870). Send, to the mining address, from wallet_2, multiple 0.00001870 BCH in one transanction e.g. - paste in send tab - pay to field: 

`simpleledger:yourminingaddress,0.00001870`
`simpleledger:yourminingaddress,0.00001870`
`simpleledger:yourminingaddress,0.00001870`
`simpleledger:yourminingaddress,0.00001870`
`simpleledger:yourminingaddress,0.00001870`
`simpleledger:yourminingaddress,0.00001870`
`simpleledger:yourminingaddress,0.00001870`
`simpleledger:yourminingaddress,0.00001870`
`simpleledger:yourminingaddress,0.00001870`
`simpleledger:yourminingaddress,0.00001870`


_*You can send more ^ later_

- Right click on your mining address (in wallet_1) and get your private key (WIF)

_*Do not send other BCH to your mining address, otherwise you could pay high fee or you will not mine anything_

_*You can download Mminer prepared for mining dSLP [here](https://github.com/mazetoken/mining/raw/master/dslpmminer.zip)_


#### Mining on Windows

#### First method:

- Download [Mminer](https://github.com/mazetoken/mminer/archive/main.zip). Copy unzipped mminer-main folder to drive C. Open the folder and open .env file in notepad. Paste your WIF="..." in .env. Leave BCHD_GRPC_URL="" and BCHD_GRPC_CERT="" blank (or paste BCHD_GRPC_URL="..." if you know any). You can type your mining tag (your nick or whatever) in MINER_UTF8="...". Save the file

- Open Windows Control panel - go to "Programs" - go to "Turn Windows features on or off" - select "Windows Subsystem for Linux" and check the box, click ok and reboot Windows

- Download and install Ubuntu 20.4 LTS from Microsoft Store (type ubuntu in search bar)

- Open Ubuntu command line (Start menu - Ubuntu)

- Setup your username and password

- In a command line type commands:

`cd /mnt/c`

`sudo apt update`

`sudo apt upgrade`

`sudo apt-get install git cmake gcc g++ make`

`cd mminer-main`

`npm i`

_*Ignore errors. Do not run npm audit fix!_

`npm start`

_*Txid will be downloaded first (it may take a while) and then mining will start_

_*Press Ctrl C to stop the miner_


#### Second method:

- Make sure that Microsoft Visual C++ Redistributable is installed on your system. If it is not, you can download it from [here](https://aka.ms/vs/16/release/VC_redist.x86.exe) and [here](https://aka.ms/vs/16/release/VC_redist.x64.exe) - you need to install both

- Download and install [Nodejs](https://nodejs.org/en/) 14.15.0

- Download and install [Git](https://gitforwindows.org/)

- Download [Mminer](https://github.com/mazetoken/mminer/archive/main.zip). Copy unzipped mminer-main folder to drive C. Open the folder and open .env file in notepad. Paste your WIF="..." in .env. Leave BCHD_GRPC_URL="" and BCHD_GRPC_CERT="" blank (or paste BCHD_GRPC_URL="..." if you know any). You can type your mining tag (your nick or whatever) in MINER_UTF8="...". Save the file

- Open Windows PowerShell (Windows X) and type commands:

`npm i -g npm@7.0.6`

_*Ignore errors. Do not update npm_

`cd ..`

`cd  ..`

`cd mminer-main`

`npm i`

_*Do not run npm audit fix !_

`npm start`

_*Txid will be downloaded first (it may take a while) and then mining will start_

_*Press Ctrl C and type Y to stop the miner_


#### Mining on Android phone

_*You may need 2GB ram_

#### Go to Google Play Store and download UserLAnd app

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

_*Ignore errors. Do not update npm_

`sudo apt-get install cmake gcc g++ make`

`sudo apt-get install nano zip unzip`

`git clone https://github.com/mazetoken/mminer.git`

`cd mminer`

`sudo nano .env`

_*Type/paste your WIF="..."_

_*Leave BCHD_GRPC_URL="" and BCHD_GRPC_CERT="" blank (or paste BCHD_GRPC_URL="..." if you know any)_

_*You can type your mining tag (your nick or whatever) in MINER_UTF8="..."_

_*You can set fastmine to "no" if you don't want to install CMake (below), but mining is faster with fastmine set to "yes"_

_*Tap: ctrl O enter - to save changes and ctrl X enter - to exit editor_


#### Download CMake, but not to the mminer directory (we need a new version of CMake for fastmine). Unfortunately, it will take some time - a few hours, so be patient. You can change the sleep time of your phone display to 30 minutes to make it a little faster. You can skip this if you do not want to mine with fastmine (we do not need fastmine to mine dSLP token - fastmine is set to "no" by default)

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

#### Install and start the miner. Type commands:

`cd mminer`

`npm i`

_*Ignore errors. Do not run npm audit fix !_

`npm start`

_*Txid will be downloaded first (it may take a while) and then mining will start_

_*Javascript heap out of memory error may appear. You will need to setup and run the miner on desktop and download .cache file from mminer-main folder to mminer directory in your phone_

_*Tap Ctrl C (to stop the miner)_

Start the miner again (if you have closed UserLAnd app) - open the app, type your password and type commands:

`cd mminer`

`npm start`


#### If you need any help, ask in Maze [Group](https://t.me/mazemining)

--------------------------------------------------------------------------------------

#### Maze and other mineable tokens environment

_*There will be eight halving events. Total supply will not be higher than 21 million_

_*Change token environment in .env file to mine different tokens. Use different addressess for different tokens_

Maze:

`TOKEN_INIT_REWARD_V1=800000000`
`TOKEN_HALVING_INTERVAL_V1=4320`
`MINER_DIFFICULTY_V1=3`
`MINER_UTF8=""`
`TOKEN_START_BLOCK_V1=645065`
`TOKEN_ID_V1="bb553ac2ac7af0fcd4f24f9dfacc7f925bfb1446c6e18c7966db95a8d50fb378"`
`USE_FASTMINE="yes"`

Maze reward schedule:

Token Height | Maze Reward

`1-4319 | 800`
`4320-8639 | 400`
`8640-12959 | 266,666666`
`12960-17279 | 200`
`17280-21599 | 160`
`21600-25919 | 133,333333`
`25920-30239 | 114,292929`
`30240-34559 | 100`
`34560< | ...`

Mist:

`TOKEN_INIT_REWARD_V1=400000000`
`TOKEN_HALVING_INTERVAL_V1=4320`
`MINER_DIFFICULTY_V1=3`
`MINER_UTF8=""`
`TOKEN_START_BLOCK_V1=639179`
`TOKEN_ID_V1="d6876f0fce603be43f15d34348bb1de1a8d688e1152596543da033a060cff798"`
`USE_FASTMINE="yes"`

dSLP:

`TOKEN_INIT_REWARD_V1=2000000`
`TOKEN_HALVING_INTERVAL_V1=6480`
`MINER_DIFFICULTY_V1=2`
`MINER_UTF8=""`
`TOKEN_START_BLOCK_V1=653104`
`TOKEN_ID_V1="5aa6c9485f746cddfb222cba6e215ab2b2d1a02f3c2506774b570ed40c1206e8"`
`USE_FASTMINE="no"`

dSLP reward schedule:

Token Height | Maze Reward

`1-6479 | 200 dSLP`
`6480-12959 | 100 dSLP`
`12960-19439 | 66,6666 dSLP`
`19440-25919 | 50 dSLP`
`25920-32399 | 40 dSLP`
`32400-38879 | 33,3232 dSLP`
`38880-45359 | 25,5555 dSLP`
`45360-51839 | 25 dSLP`
`51840< | ...`

BTCL:

`TOKEN_INIT_REWARD_V1=800000000`
`TOKEN_HALVING_INTERVAL_V1=4320`
`MINER_DIFFICULTY_V1=3`
`MINER_UTF8=""`
`TOKEN_START_BLOCK_V1=655223`
`TOKEN_ID_V1="20e8e13347a76f6041bf7d31b04a7bbb7e2deb5d95e15ae8619179b3552ca02a"`
`USE_FASTMINE="yes"`

--------------------------------------------------------------------------------


