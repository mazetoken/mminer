#### mminer v.1.0.0
by B_S_Z

This is updated version of Mist miner - bchd_mist_miner_v1 (from https://mistcoin.org)

I am not a programmer, so use it at your own risk. No guarantee that this miner is faster than other miners, but from now I will only work with mminer (mazebchdminer will not be updated)

Mminer is prepared for mining MAZE on windows and linux and is patched for BigNumber error and dust input attack filter (just like mazebchdmminer). You but you can mine other tokens too (Mist, dSLP or BTCL)

Update nodejs to 14.15 and npm to 7.0.6

What is updated:
- package.json - updated npm packages
- generateV1.ts - support for slpjs v.0.27.8 and grpc-bchrpc-node v.0.11.3

For mining tutorial go to: https://github.com/mazetoken/mining

---------------------------------------------------------------
Maze and other tokens environment

Maze:

`TOKEN_INIT_REWARD_V1=800000000`
`TOKEN_HALVING_INTERVAL_V1=4320`
`MINER_DIFFICULTY_V1=3`
`MINER_UTF8=""`
`TOKEN_START_BLOCK_V1=645065`
`TOKEN_ID_V1="bb553ac2ac7af0fcd4f24f9dfacc7f925bfb1446c6e18c7966db95a8d50fb378"`
`USE_FASTMINE="yes"`

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

BTCL:

`TOKEN_INIT_REWARD_V1=800000000`
`TOKEN_HALVING_INTERVAL_V1=4320`
`MINER_DIFFICULTY_V1=3`
`MINER_UTF8=""`
`TOKEN_START_BLOCK_V1=655223`
`TOKEN_ID_V1="20e8e13347a76f6041bf7d31b04a7bbb7e2deb5d95e15ae8619179b3552ca02a"`
`USE_FASTMINE="yes"`

