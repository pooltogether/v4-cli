import {BigNumber} from '@ethersproject/bignumber'

function sumPrizeAmounts(list: any[][]): string {
  return list
  .flat(1)
  .map((prize: any) => prize.amount)
  // eslint-disable-next-line unicorn/no-array-reduce
  .reduce((a, b) => a.add(b), BigNumber.from(0))
  .toString()
}

export default sumPrizeAmounts
