<<<<<<< HEAD
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
=======
import { Contract, ContractList } from '@pooltogether/contract-list-schema';
import { ContractType, PrizeDistributorV1 } from '@pooltogether/v4-client-js';
import { mainnet } from '@pooltogether/v4-pool-data';

import { getContract, getProvider } from '../utils';

export default async function getNewestPrizeDistribution(
  chainId: string,
  network: ContractList,
): Promise<any> {
  const ContractPrizeDistributor = getContract(chainId, ContractType.PrizeDistributor, network);
>>>>>>> 55936e9 (feat(drawPrizes): update draw calculation)

  const prizeDistributor = new PrizeDistributorV1(
    ContractPrizeDistributor,
    getProvider(chainId),
    mainnet.contracts as unknown as Contract[],
  );

  const ContractPrizeDistributionsBuffer =
    await prizeDistributor.getPrizeDistributionsBufferContract();
  const prizeDistribution = await ContractPrizeDistributionsBuffer.getNewestPrizeDistribution();

  return prizeDistribution;
}
