import {BigNumber} from '@ethersproject/bignumber'
import {Prize} from '@pooltogether/v4-utils-js'

function sumPrizeAmounts(list: Prize[]): string {
  return list
  .map((prize: any) => prize.amount)
  // eslint-disable-next-line unicorn/no-array-reduce
  .reduce((a, b) => a.add(b), BigNumber.from(0))
  .toString()
}

export default sumPrizeAmounts
