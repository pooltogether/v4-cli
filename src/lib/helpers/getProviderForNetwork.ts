function getProviderForNetwork(chainId: string): string | undefined {
  let providerUrl: string | undefined = ''

  switch (chainId) {
  case '1': {
    providerUrl = process.env.ETHEREUM_MAINNET_RPC_URL

    break
  }

  case '137': {
    providerUrl = process.env.POLYGON_MAINNET_RPC_URL

    break
  }

  case '43114': {
    providerUrl = process.env.AVALANCHE_MAINNET_RPC_URL

    break
  }
  // No default
  }

  if (providerUrl === '') {
    const e = new Error('Chain ID not supported')
    // @ts-ignore
    e.code = 'CHAIN_ID_NOT_SUPPORTED'
    throw e
  }

  return providerUrl
}

export default getProviderForNetwork
