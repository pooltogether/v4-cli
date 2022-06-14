import {getContractsByType, sortContractsByChainId} from '@pooltogether/v4-client-js'
import {mainnet, testnet} from '@pooltogether/v4-pool-data'

function getContract(chainId: string, name: string, isTestnet?: boolean): any {
  try {
    const network = isTestnet ? testnet : mainnet
    // @ts-ignore
    const contract = getContractsByType(network.contracts, name)
    const contracts = sortContractsByChainId(contract)
    // @ts-ignore
    return contracts[chainId][0]
  } catch {
    throw new Error(`Contract ${name} not found for chainId ${chainId}`)
  }
}

export default getContract
