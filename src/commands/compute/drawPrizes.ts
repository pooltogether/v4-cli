// @ts-nocheck
import {Command, Flags} from '@oclif/core'
import {BigNumber} from '@ethersproject/bignumber'
import {PrizeDistributor, PrizePool} from '@pooltogether/v4-client-js'
import mainnet from '../../mainnet'
import {
  calculateUserBalanceFromAccount,
  calculateNormalizedUserBalancesFromTotalSupply,
  utils,
  Account, NormalizedUserBalance, Prize, UserBalance,
} from '@pooltogether/v4-utils-js'
import {StatusError} from '../../types'
import {getUserAccountsFromSubgraphForTicket} from '../../lib/network/getUserAccountsFromSubgraphForTicket'
import {runCalculateDrawResultsWorker} from '../../lib/workers/createWorkers'

import createStatus from '../../lib/utils/createStatus'
import updateStatusFailure from '../../lib/utils/updateStatusFailure'
import updateStatusSuccess from '../../lib/utils/updateStatusSuccess'
import getContract from '../../lib/utils/getContract'
import getProvider from '../../lib/utils/getProvider'
import createOutputPath from '../../lib/utils/createOutputPath'
import createExitCode from '../../lib/utils/createExitCode'
import writeToOutput from '../../lib/utils/writeToOutput'
import writePrizesToOutput from '../../lib/utils/writePrizesToOutput'
import verifyAgainstSchema from '../../lib/utils/createStatus'

/**
 * @name DrawPrizes
 */
export default class DrawPrizes extends Command {
  static description = 'Compute Depositor prizes for a previous Draw'
  static examples = [
    `$ ptv4 compute drawPrizes --chainId 1 --drawId 1 --ticket 0x0000000000000000000000000000000000000000 --outDir ./temp/calculate
  Running compute:drawPrizes on chainId: 1 using drawID: 1
  `,
  ]

  static flags = {
    chainId: Flags.string({
      char: 'c',
      description: 'ChainId (1 for Ethereum Mainnet, 80001 for Polygon Mumbai, etc...)',
      required: true,
    }),
    ticket: Flags.string({
      char: 't',
      description: 'Ticket Address',
      required: true,
    }),
    drawId: Flags.string({
      char: 'd',
      description: 'Draw ID',
      required: true,
    }),
    outDir: Flags.string({
      char: 'o',
      description: 'Output Directory',
      required: true,
    }),
  }

  static args = []

  // Share the same initial status object between all commands

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async catch(error:any):Promise<any> {
    console.log(error, '_error')
    const statusLoading = createStatus()
    const {flags} = await this.parse(DrawPrizes)
    const {chainId, drawId, outDir} = flags
    const prizeDistributorContract = getContract(chainId, 'PrizeDistributor')
    this.warn('Failed to calculate Draw Prizes (' + error + ')')
    const statusFailure = updateStatusFailure(statusLoading.createdAt, error as StatusError)
    const outDirWithSchema = createOutputPath(outDir, chainId, prizeDistributorContract.address, drawId)
    writeToOutput(outDirWithSchema, 'status', statusFailure)
    createExitCode(error, this)
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(DrawPrizes)
    const statusLoading = createStatus()
    this.log(`Running "calculate:prizes" on chainId: ${flags.chainId} using drawID: ${flags.drawId}`)
    const {chainId, drawId, ticket, outDir} = flags
    this.log(chainId, drawId, ticket, outDir)

    /* -------------------------------------------------- */
    // Create Status File
    /* -------------------------------------------------- */
    const ContractPrizePool = getContract(chainId, 'YieldSourcePrizePool')
    const ContractPrizeDistributor = getContract(chainId, 'PrizeDistributor')
    const outDirWithSchema = createOutputPath(outDir, chainId, ContractPrizeDistributor.address, drawId)
    writeToOutput(outDirWithSchema, 'status', statusLoading)

    // /* -------------------------------------------------- */
    // // Data Fetching
    // /* -------------------------------------------------- */
    const prizePool = new PrizePool(ContractPrizePool, getProvider(chainId), mainnet.contracts)
    const prizeDistributor = new PrizeDistributor(ContractPrizeDistributor, getProvider(chainId), mainnet.contracts)
    const ContractDrawBuffer = await prizeDistributor.getDrawBufferContract() as any
    const ContractPrizeDistributionsBuffer = await prizeDistributor.getPrizeDistributionsBufferContract() as any
    const ContractTicket = await prizePool.getTicketContract() as any
    const Draw = await ContractDrawBuffer.getDraw(drawId)
    const PrizeDistribution = await ContractPrizeDistributionsBuffer.getPrizeDistribution(drawId)
    const drawStartTimestamp = Draw.timestamp - PrizeDistribution.startTimestampOffset
    const drawEndTimestamp = Draw.timestamp - PrizeDistribution.endTimestampOffset
    const ticketTotalSupplies: BigNumber[] = await ContractTicket.getAverageTotalSuppliesBetween([drawStartTimestamp], [drawEndTimestamp])
    const userAccounts = await getUserAccountsFromSubgraphForTicket(
      chainId,
      ticket,
      drawStartTimestamp,
      drawEndTimestamp,
    )

    // /* -------------------------------------------------- */
    // // Computation
    // /* -------------------------------------------------- */
    const userBalances: any[] = userAccounts.map((account: Account) => {
      const balance = calculateUserBalanceFromAccount(
        account,
        drawStartTimestamp,
        drawEndTimestamp,
      )
      if (!balance) {
        return
      }

      return {
        balance,
        address: account.id,
      }
    })
    const filteredUserBalances: UserBalance[] = utils.filterUndefinedValues<UserBalance>(userBalances)
    const normalizedUserBalances: NormalizedUserBalance[] = calculateNormalizedUserBalancesFromTotalSupply(
      filteredUserBalances,
      ticketTotalSupplies[0],
    )

    /* -------------------------------------------------- */
    // Compute Prizes & Write to Disk
    /* -------------------------------------------------- */

    /**
     * @TODO: Add error handling on an account level, so if a worker fails, we can still
     *        continue to the next account while catching the error for an individual account.
     */
    const prizes: Prize[][] = await runCalculateDrawResultsWorker(
      normalizedUserBalances,
      PrizeDistribution,
      Draw,
    )

    const _flatPrizes = prizes.flat(1)
    if (!verifyAgainstSchema(_flatPrizes)) {
      const e = new Error('Invalid Prize Schema') as any
      e.code = 'INVALID_PRIZE_SCHEMA'
      throw e
    }

    writeToOutput(outDirWithSchema, 'prizes', _flatPrizes)
    writePrizesToOutput(outDirWithSchema, prizes)
    const statusSuccess = updateStatusSuccess(statusLoading.createdAt, {
      prizeLength: prizes.length,
      // amountsTotal: sumPrizeAmounts(prizes),
    })
    writeToOutput(outDirWithSchema, 'status', statusSuccess)
  }
}
