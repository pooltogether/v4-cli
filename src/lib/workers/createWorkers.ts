// eslint-disable-next-line node/no-missing-import
import {resolve} from 'node:path'
import Piscina from 'piscina'
import {NormalizedUserBalance, Prize, Draw, PrizeDistribution, utils} from '@pooltogether/v4-utils-js'

async function runCalculateDrawResultsWorker(
  normalizedUserBalances?: NormalizedUserBalance[],
  prizeDistribution?: PrizeDistribution,
  draw?: Draw,
): Promise<Prize[][]> {
  if (!normalizedUserBalances || !prizeDistribution || !draw) {
    throw new Error('Invalid input parameters')
  }

  const piscina = new Piscina({
    // eslint-disable-next-line unicorn/prefer-module
    filename: resolve(__dirname, './calculatePrizeForUser.js'),
  })

  let prizes = await Promise.all(
    normalizedUserBalances.map(async (userBalance: NormalizedUserBalance) => {
      // serialize the data as strings
      const user = {
        address: userBalance.address,
        balance: userBalance.normalizedBalance.toString(),
      }
      const _prizeDistribution = {
        ...prizeDistribution,
        numberOfPicks: prizeDistribution.numberOfPicks.toString(),
        bitRangeSize: prizeDistribution.bitRangeSize,
        prize: prizeDistribution.prize.toString(),
      }
      const _draw = {
        ...draw,
        winningRandomNumber: draw.winningRandomNumber.toString(),
      }
      const workerArgs = {
        user,
        prizeDistribution: _prizeDistribution,
        draw: _draw,
      }

      return piscina.run(workerArgs)
    }),
  )
  // remove empty arrays and zero value prizes
  prizes = prizes.filter(prize => {
    if (!prize) {
      return false
    }

    return prize.length > 0
  })
  // remove undefined values
  const filteredPrizes: Prize[][] = utils.filterUndefinedValues<Prize[]>(prizes)
  return filteredPrizes
}

export default runCalculateDrawResultsWorker
