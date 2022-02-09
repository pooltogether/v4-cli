// @ts-nocheck
import {getContractsByType, sortContractsByChainId} from '@pooltogether/v4-client-js'
import mainnet from '../contracts'

// export function getContractsByType(contracts: any, type: any): any {
//   return contracts.filter(contract => contract.type === type)
// }

// export function sortContractsByChainId(contracts: any): { [key: number]: any } {
//   const sortedContracts = {} as { [key: number]: any }
//   const chainIds = new Set(contracts.map(c => c.chainId))
//   for (const chainId of chainIds) {
//     const filteredContracts = contracts.filter(c => c.chainId === chainId)
//     sortedContracts[chainId] = filteredContracts
//   }

//   return sortedContracts
// }

function getContract(chainId: string, name: string): any {
  // @ts-ignore
  try {
    const contract = getContractsByType(mainnet.contracts, name)
    const contracts = sortContractsByChainId(contract)
    // @ts-ignore
    return contracts[chainId][0]
  } catch {
    throw new Error(`Contract ${name} not found for chainId ${chainId}`)
  }
}

export default getContract
