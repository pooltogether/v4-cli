import { resolve } from 'node:path';
import Piscina from 'piscina';
import {
  computeUserPicksFromNormalizedBalance,
  NormalizedUserBalance,
  Prize,
  Draw,
  PrizeDistribution,
  utils,
  PrizeConfig,
} from '@pooltogether/v4-utils-js';

import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';

export const runCalculateDrawResultsWorkerV2 = async (
  ticket: string,
  drawCalculator: Contract,
  normalizedUsersBalance: NormalizedUserBalance[],
  prizeConfig: PrizeConfig,
  draw: Draw,
  drawId: BigNumber,
  totalPicks: BigNumber,
): Promise<Prize[][]> => {
  if (!normalizedUsersBalance || !prizeConfig || !draw) {
    throw new Error('Invalid input parameters');
  }

  const piscina = new Piscina({
    // eslint-disable-next-line unicorn/prefer-module
    filename: resolve(__dirname, './calculatePrizeForUser.js'),
  });

  let prizes = await Promise.all(
    normalizedUsersBalance.map(async ({ address, normalizedBalance }: NormalizedUserBalance) => {
      const userPicks = await drawCalculator.callStatic.calculateUserPicks(ticket, address, [drawId]);

      return piscina.run({
        user: {
          address,
          balance: normalizedBalance.toString(),
          picks: userPicks,
        },
        prizeDistribution: {
          ...prizeConfig,
          numberOfPicks: totalPicks,
        },
        draw: {
          ...draw,
          winningRandomNumber: draw.winningRandomNumber.toString(),
        },
      });
    }),
  );

  // remove empty arrays and zero value prizes
  prizes = prizes.filter(prize => {
    if (!prize) {
      return false;
    }

    return prize.length > 0;
  });

  // remove undefined values
  const filteredPrizes: Prize[][] = utils.filterUndefinedValues<Prize[]>(prizes);
  return filteredPrizes;
};

export async function runCalculateDrawResultsWorkerV1(
  normalizedUserBalances?: NormalizedUserBalance[],
  prizeDistribution?: PrizeDistribution,
  draw?: Draw,
): Promise<Prize[][]> {
  if (!normalizedUserBalances || !prizeDistribution || !draw) {
    throw new Error('Invalid input parameters');
  }

  const piscina = new Piscina({
    // eslint-disable-next-line unicorn/prefer-module
    filename: resolve(__dirname, './calculatePrizeForUser.js'),
  });

  const totalPicks = BigNumber.from(BigNumber.from(2).pow(prizeDistribution.bitRangeSize)).pow(
    prizeDistribution.matchCardinality,
  );

  let prizes = await Promise.all(
    normalizedUserBalances.map(async (userBalance: NormalizedUserBalance) => {
      const userPicks = computeUserPicksFromNormalizedBalance(
        totalPicks,
        userBalance.address,
        userBalance.normalizedBalance,
      );

      const user = {
        address: userBalance.address,
        balance: userBalance.normalizedBalance.toString(),
        picks: userPicks,
      };

      const _prizeDistribution = {
        ...prizeDistribution,
        numberOfPicks: prizeDistribution.numberOfPicks.toString(),
        bitRangeSize: prizeDistribution.bitRangeSize,
        prize: prizeDistribution.prize.toString(),
      };

      const _draw = {
        ...draw,
        winningRandomNumber: draw.winningRandomNumber.toString(),
      };

      const workerArgs = {
        user,
        prizeDistribution: _prizeDistribution,
        draw: _draw,
      };

      return piscina.run(workerArgs);
    }),
  );
  // remove empty arrays and zero value prizes
  prizes = prizes.filter(prize => {
    if (!prize) {
      return false;
    }

    return prize.length > 0;
  });
  // remove undefined values
  const filteredPrizes: Prize[][] = utils.filterUndefinedValues<Prize[]>(prizes);
  return filteredPrizes;
}
