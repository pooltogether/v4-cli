import { PrizeDistributorV1, PrizeDistributorV2 } from '@pooltogether/v4-client-js';

export default async function getDraw(
  prizeDistributor: PrizeDistributorV1 | PrizeDistributorV2,
  drawId: string,
): Promise<any> {
  const ContractDrawBuffer = await prizeDistributor.getDrawBufferContract();
  return ContractDrawBuffer.getDraw(drawId);
}
