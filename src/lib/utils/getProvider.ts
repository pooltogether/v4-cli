/* eslint-disable unicorn/numeric-separators-style */
import {JsonRpcProvider} from '@ethersproject/providers'

const _providers = {
  1: new JsonRpcProvider(process.env.ETHEREUM_MAINNET_RPC_URL),
  137: new JsonRpcProvider(process.env.POLYGON_MAINNET_RPC_URL),
  43114: new JsonRpcProvider(process.env.AVALANCHE_MAINNET_RPC_URL),
  4: new JsonRpcProvider(process.env.ETHEREUM_RINKEBY_RPC_URL),
  80001: new JsonRpcProvider(process.env.POLYGON_MUMBAI_RPC_URL),
  43113: new JsonRpcProvider(process.env.AVALANCHE_FUJI_RPC_URL),
}

const getProvider = (chainId: string) => {
  // @ts-ignore
  const provider = _providers[chainId]
  if (!provider) {
    throw new Error(`No provider for chainId ${chainId}`)
  }

  return provider
}

export default getProvider
