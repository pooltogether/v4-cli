import {Command, Flags} from '@oclif/core'
import checkIfCLIRunRequired from '../../lib/helpers/checkIfCLIRunRequired'
import getNewestPrizeDistribution from '../../lib/helpers/getNewestPrizeDistribution'
import findMostRecentDrawCommitedForChainId from '../../lib/helpers/findMostRecentDrawCommitedForChainId'
import spawnComputeDrawPrizesProcess from '../../lib/workers/spawnComputeDrawPrizesProcess'
import * as core from '@actions/core'

export default class PoolPrizes extends Command {
  static description = 'Computes all historical Draw prizes for a PrizePool to a target output directory.'
  static examples = []

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
    outDir: Flags.string({
      char: 'o',
      description: 'Output Directory',
      required: true,
    }),
  }

  static args = []

  public async catch(error:any):Promise<any> {
    core.setOutput('error', error)
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(PoolPrizes)
    const {chainId, ticket, outDir} = flags
    const runRequired = await checkIfCLIRunRequired(outDir, chainId, ticket)
    if (runRequired) {
      const newestPrizeDistribution = await getNewestPrizeDistribution(chainId)
      const mostRecentCommitedDrawIdResult = findMostRecentDrawCommitedForChainId(outDir, chainId, ticket)
      const mostRecentCommitedDrawId = Number.parseInt(mostRecentCommitedDrawIdResult, 10)
      const draws = Array.from(
        {length: newestPrizeDistribution.drawId - mostRecentCommitedDrawId},
        (v, k) => k + mostRecentCommitedDrawId + 1,
      )
      for (const drawId of draws) {
        console.log(`Computing Draw prizes for drawId: ${drawId} on chainId: ${chainId} using ticket: ${ticket}`)
        // eslint-disable-next-line no-await-in-loop
        await spawnComputeDrawPrizesProcess(chainId, drawId, ticket, outDir)
      }

      core.setOutput('runStatus', 'true')
      core.setOutput('drawIds', JSON.stringify(draws))
    }
  }
}
