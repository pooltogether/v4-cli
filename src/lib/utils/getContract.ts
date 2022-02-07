import {Contract, getContractsByType, sortContractsByChainId} from '@pooltogether/v4-client-js'
import {mainnet} from '@pooltogether/v4-pool-data'

function getContract(chainId: string, name: string): Contract {
  // @ts-ignore
  const contract = getContractsByType(mainnet.contracts, name)
  const contracts = sortContractsByChainId(contract)
  try {
    // @ts-ignore
    return contracts[chainId][0]
  } catch {
    throw new Error(`Contract ${name} not found for chainId ${chainId}`)
  }
}

export default getContract
