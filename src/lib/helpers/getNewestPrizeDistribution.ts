import { Contract, ContractList } from '@pooltogether/contract-list-schema';
import { ContractType, PrizeDistributorV1 } from '@pooltogether/v4-client-js';
import { mainnet } from '@pooltogether/v4-pool-data';

import { getContract, getProvider } from '../utils';

export default async function getNewestPrizeDistribution(
  chainId: string,
  network: ContractList,
): Promise<any> {
  const ContractPrizeDistributor = getContract(chainId, ContractType.PrizeDistributor, network);

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
