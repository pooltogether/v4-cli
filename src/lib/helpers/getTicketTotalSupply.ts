/* eslint-disable no-await-in-loop */
import { BigNumberish } from '@ethersproject/bignumber';
import {
  Contract,
  ContractList,
  ContractType,
  PrizePool,
} from '@pooltogether/v4-client-js';

import { getContracts, getProvider } from '../utils';

export const getTicketSecondaryListAverageTotalSupply = async (
  ticket: string,
  chainId: string,
  network: ContractList,
  drawStartTimestamp: number,
  drawEndTimestamp: number,
): Promise<BigNumberish[]> => {
  const prizePoolContracts = getContracts(chainId, ContractType.PrizePool, network);

  const ticketSecondaryListAverageTotalSupply: BigNumberish[] = [];

  for (const prizePoolContract of prizePoolContracts) {
    const prizePool = new PrizePool(
      prizePoolContract,
      getProvider(chainId),
      network.contracts as unknown as Contract[],
    );

    const ContractTicket = await prizePool.getTicketContract();

    if (ContractTicket.address !== ticket) {
      const ticketAverageTotalSupply = await ContractTicket.getAverageTotalSuppliesBetween(
        [drawStartTimestamp],
        [drawEndTimestamp],
      );

      ticketSecondaryListAverageTotalSupply.push(ticketAverageTotalSupply[0]);
    }
  }

  return ticketSecondaryListAverageTotalSupply;
};
