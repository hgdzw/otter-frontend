export const EPOCH_INTERVAL = 2200;
export const TOKEN_DECIMALS = 9;
export const BLOCK_RATE_SECONDS = 2;

export enum Networks {
  UNKNOW = 0,
  POLYGON_MAINNET = 137,
  POLYGON_MUMBAI = 80001,
}

export const RPCURL = {
  POLYGON_MAINNET: 'https://polygon-rpc.com',
  POLYGON_MUMBAI: 'https://rpc-mumbai.maticvigil.com/v1/f7267a10cbbde8680bd7534bfeb573758ad39a99',
};

export const DEFAULT_NETWORK = Networks.POLYGON_MUMBAI;
