import {
  MAINNET_TWAB_SUBGRAPH_URL,
  POLYGON_TWAB_SUBGRAPH_URL,
  RINKEBY_TWAB_SUBGRAPH_URL,
  MUMBAI_TWAB_SUBGRAPH_URL,
  AVALANCHE_TWAB_SUBGRAPH_URL,
} from '../constants'

function getSubgraphUrlForNetwork(chainId: string): string {
  switch (chainId) {
  case '1':
    return MAINNET_TWAB_SUBGRAPH_URL
  case '137':
    return POLYGON_TWAB_SUBGRAPH_URL
  case '4':
    return RINKEBY_TWAB_SUBGRAPH_URL
  case '43114':
    return AVALANCHE_TWAB_SUBGRAPH_URL
  case '80001':
    return MUMBAI_TWAB_SUBGRAPH_URL
  default:
    throw new Error(`Unsupported network: ${chainId}`)
  }
}

export default getSubgraphUrlForNetwork
