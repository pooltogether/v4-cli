import {TESTNET_ENV_CHAIN_IDS} from '../constants'

const isTestnet = (chainId: string) => {
  return TESTNET_ENV_CHAIN_IDS.includes(chainId)
}

export default isTestnet
