import {BigNumber} from '@ethersproject/bignumber'

import {Prize} from '@pooltogether/v4-utils-js'

function sumPrizeAmounts(list: Prize[][]): string {
  return list
  .flat(1)
  .map((prize: Prize) => prize.amount)
  // eslint-disable-next-line unicorn/no-array-reduce
  .reduce((a, b) => a.add(b), BigNumber.from(0))
  .toString()
}

export default sumPrizeAmounts
