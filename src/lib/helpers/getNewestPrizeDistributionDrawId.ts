import { Contract, ContractList } from '@pooltogether/contract-list-schema';
import { ContractType, PrizeDistributorV1 } from '@pooltogether/v4-client-js';

import { defaultVersion, getContract, getDrawBufferContract, getProvider } from '../utils';

export default async function getNewestPrizeDistributionDrawId(
  chainId: string,
  network: ContractList,
  version = '1',
): Promise<any> {
  let newestPrizeDistributionDrawId: number;

  if (version === '2') {
    const drawBuffer = await getDrawBufferContract(chainId, network);

    newestPrizeDistributionDrawId = (await drawBuffer.getNewestDraw()).drawId;
  } else {
    const ContractPrizeDistributor = await getContract(
      chainId,
      ContractType.PrizeDistributor,
      network,
      defaultVersion,
    );

    const prizeDistributor = new PrizeDistributorV1(
      ContractPrizeDistributor,
      getProvider(chainId),
      network.contracts as unknown as Contract[],
    );

    const ContractPrizeDistributionsBuffer =
      await prizeDistributor.getPrizeDistributionsBufferContract();

    newestPrizeDistributionDrawId = (await ContractPrizeDistributionsBuffer.getNewestPrizeDistribution()).drawId;
  }

  return newestPrizeDistributionDrawId;
}
