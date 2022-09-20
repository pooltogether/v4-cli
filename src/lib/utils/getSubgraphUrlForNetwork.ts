import {
  MAINNET_TWAB_SUBGRAPH_URL,
  POLYGON_TWAB_SUBGRAPH_URL,
  AVALANCHE_TWAB_SUBGRAPH_URL,
  OPTIMISM_TWAB_SUBGRAPH_URL,
  GOERLI_TWAB_SUBGRAPH_URL,
  MUMBAI_TWAB_SUBGRAPH_URL,
  OPTIMISM_GOERLI_TWAB_SUBGRAPH_URL,
  ARBITRUM_GOERLI_TWAB_SUBGRAPH_URL,
} from '../constants'

function getSubgraphUrlForNetwork(chainId: string): string {
  switch (chainId) {
  case '1':
    return MAINNET_TWAB_SUBGRAPH_URL
  case '137':
    return POLYGON_TWAB_SUBGRAPH_URL
  case '43114':
    return AVALANCHE_TWAB_SUBGRAPH_URL
  case '10':
    return OPTIMISM_TWAB_SUBGRAPH_URL
  case '5':
    return GOERLI_TWAB_SUBGRAPH_URL
  case '80001':
    return MUMBAI_TWAB_SUBGRAPH_URL
  case '420':
    return OPTIMISM_GOERLI_TWAB_SUBGRAPH_URL
  case '421613':
    return ARBITRUM_GOERLI_TWAB_SUBGRAPH_URL
  default:
    throw new Error(`Unsupported network: ${chainId}`)
  }
}

export default getSubgraphUrlForNetwork
