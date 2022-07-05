/* eslint-disable node/no-extraneous-import */
import {PrizeDistributor} from '@pooltogether/v4-client-js'
import {mainnet, testnet} from '@pooltogether/v4-pool-data'

import {getContract, getProvider, isTestnet} from '../utils'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function getNewestPrizeDistribution(chainId:any): Promise<any> {
  const isTestnetNetwork = isTestnet(chainId)
  const network = isTestnetNetwork ? testnet : mainnet

  const ContractPrizeDistributor = getContract(chainId, 'PrizeDistributor', isTestnetNetwork)

  const prizeDistributor = new PrizeDistributor(ContractPrizeDistributor, getProvider(chainId), network.contracts)
  const ContractPrizeDistributionsBuffer = await prizeDistributor.getPrizeDistributionsBufferContract() as any

  const prizeDistribution = await ContractPrizeDistributionsBuffer.getNewestPrizeDistribution()
  return prizeDistribution
}

export default getNewestPrizeDistribution
