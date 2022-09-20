import {JsonRpcProvider} from '@ethersproject/providers'

type Providers = { [k: string]: JsonRpcProvider };

const providers: Providers = {
  // mainnets
  1: new JsonRpcProvider(process.env.ETHEREUM_MAINNET_RPC_URL),
  137: new JsonRpcProvider(process.env.POLYGON_MAINNET_RPC_URL),
  43114: new JsonRpcProvider(process.env.AVALANCHE_MAINNET_RPC_URL),
  10: new JsonRpcProvider(process.env.OPTIMISM_MAINNET_RPC_URL),
  // testnets
  5: new JsonRpcProvider(process.env.ETHEREUM_GOERLI_RPC_URL),
  80001: new JsonRpcProvider(process.env.POLYGON_MUMBAI_RPC_URL),
  43113: new JsonRpcProvider(process.env.AVALANCHE_FUJI_RPC_URL),
  420: new JsonRpcProvider(process.env.OPTIMISM_GOERLI_RPC_URL),
  421613: new JsonRpcProvider(process.env.ARBITRUM_GOERLI_RPC_URL),
}

const getProvider = (chainId: string): JsonRpcProvider => {
  const provider = providers[chainId]

  if (!provider) {
    throw new Error(`No provider for chainId ${chainId}`)
  }

  return provider
}

export default getProvider
