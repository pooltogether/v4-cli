/* eslint-disable unicorn/numeric-separators-style */
import {JsonRpcProvider} from '@ethersproject/providers'

const mainnet_ids = ["1", "137", "43114", "10"];
const testnet_ids = ["4", "80001", "43113", "69"];

const _providers = {
  // mainnets
  1: new JsonRpcProvider(process.env.ETHEREUM_MAINNET_RPC_URL),
  137: new JsonRpcProvider(process.env.POLYGON_MAINNET_RPC_URL),
  43114: new JsonRpcProvider(process.env.AVALANCHE_MAINNET_RPC_URL),
  10: new JsonRpcProvider(process.env.OPTIMISM_MAINNET_RPC_URL),
  // testnets
  4: new JsonRpcProvider(process.env.ETHEREUM_RINKEBY_RPC_URL),
  80001: new JsonRpcProvider(process.env.POLYGON_MUMBAI_RPC_URL),
  43113: new JsonRpcProvider(process.env.AVALANCHE_FUJI_RPC_URL),
  69: new JsonRpcProvider(process.env.OPTIMISM_KOVAN_RPC_URL),
}

const getProvider = (chainId: string) => {
  // @ts-ignore
  const provider = _providers[chainId]
  if (!provider) {
    throw new Error(`No provider for chainId ${chainId}`)
  }

  return provider
}

const isTestnet = (chainid: string) => {
  if (testnet_ids.includes(chainid)) {
    return true
  }

  return false
}

export default {
  getProvider,
  isTestnet,
}
