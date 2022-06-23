import { BigNumber } from '@ethersproject/bignumber';
import { computeWinningPicks, Draw, PrizeDistribution } from '@pooltogether/v4-utils-js';

type Prize = {
  address: string;
  pick: string;
  tier: number;
  amount: string;
};

type User = {
  address: string;
  picks: BigNumber[];
};

function calculatePrizeForUser({
  user,
  prizeDistribution,
  draw,
}: {
  user: User;
  draw: Draw;
  prizeDistribution: PrizeDistribution;
}): (Prize | undefined)[] | undefined {
  const [results] = computeWinningPicks(
    user.address,
    user.picks,
    [draw],
    [
      {
        bitRangeSize: prizeDistribution.bitRangeSize,
        matchCardinality: prizeDistribution.matchCardinality,
        prize: prizeDistribution.prize,
        tiers: prizeDistribution.tiers,
      },
    ],
  );

  if (results.prizes.length === 0) return;

  const prizes = results.prizes
  .map(prize => {
    if (prize.amount.eq(BigNumber.from(0))) {
      return;
    }

    return {
      address: user.address,
      pick: prize.pick.toString(),
      tier: prize.tierIndex,
      amount: prize.amount.toString(),
    };
  })
  .filter(prize => prize !== undefined);

  return prizes;
}

export default calculatePrizeForUser;
