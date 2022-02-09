/* eslint-disable node/no-extraneous-import */
import {PrizeDistributor} from '@pooltogether/v4-client-js'
import {getContract, getProvider} from '../utils'
import mainnet from '../contracts'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function getNewestPrizeDistribution(chainId:any): Promise<any> {
  const ContractPrizeDistributor = getContract(chainId, 'PrizeDistributor')
  const prizeDistributor = new PrizeDistributor(ContractPrizeDistributor, getProvider(chainId), mainnet.contracts)
  const ContractPrizeDistributionsBuffer = await prizeDistributor.getPrizeDistributionsBufferContract() as any

  const prizeDistribution = await ContractPrizeDistributionsBuffer.getNewestPrizeDistribution()
  return prizeDistribution
}

export default getNewestPrizeDistribution
