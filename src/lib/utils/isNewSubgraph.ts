import { NEW_SUBGRAPH_CHAIN_IDS } from '../constants';

export default (chainId: string): boolean => {
  return NEW_SUBGRAPH_CHAIN_IDS.includes(chainId);
};
