import {BigNumber} from '@ethersproject/bignumber'
import {PrizeDistribution, computeWinningPicks} from '@pooltogether/v4-utils-js'

function calculatePrizeForUser({user, prizeDistribution, draw}: {
  user: any;
  draw: any;
  prizeDistribution: PrizeDistribution,
}): any {
  const [results] = computeWinningPicks(user.address.toLowerCase(), [BigNumber.from(user.balance)], [draw], [prizeDistribution])
  if (results.prizes.length === 0) return
  const prizes = results.prizes
  .map(prize => {
    if (prize.amount.eq(BigNumber.from(0))) {
      return
    }

    return {
      address: user.address.toLowerCase(),
      pick: prize.pick.toString(),
      tier: prize.tierIndex,
      amount: prize.amount.toString(),
    }
  })
  .filter(prize => prize !== undefined)
  return prizes
}

export default calculatePrizeForUser
