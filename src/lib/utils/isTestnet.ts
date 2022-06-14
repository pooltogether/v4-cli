import { TESTNET_ENV_CHAIN_IDS } from '../constants';

export default (chainId: string): boolean => {
  return TESTNET_ENV_CHAIN_IDS.includes(chainId);
};
