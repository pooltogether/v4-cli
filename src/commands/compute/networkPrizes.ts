import {Command, Flags} from '@oclif/core'
import * as core from '@actions/core'
import spawnComputePrizePoolPrizesProcess from '../../lib/workers/spawnComputePrizePoolPrizesProcess'
import {
  AVALANCHE_USDC_TICKET_ADDRESS,
  MAINNET_USDC_TICKET_ADDRESS,
  POLYGON_USDC_TICKET_ADDRESS,
  OPTIMISM_MAINNET_USDC_TICKET_ADDRESS,
  OPTIMISM_KOVAN_USDC_TICKET_ADDRESS,
} from '../../lib/constants'

export default class NetworkPrizes extends Command {
  static description = 'Computes Draw prizes for all PoolTogether V4 network PrizePools to a target output directory.'
  static examples = []
  static flags = {
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
    const {flags} = await this.parse(NetworkPrizes)
    const {outDir} = flags

    const networks = [
      [1, MAINNET_USDC_TICKET_ADDRESS],
      [137, POLYGON_USDC_TICKET_ADDRESS],
      [43_114, AVALANCHE_USDC_TICKET_ADDRESS],
      [10, OPTIMISM_MAINNET_USDC_TICKET_ADDRESS],
      [69, OPTIMISM_KOVAN_USDC_TICKET_ADDRESS],
    ]

    for (const network of networks) {
      console.log(`Computing PrizePool prizes for chainId: ${network[0]} using ticket: ${network[1]}`)
      // eslint-disable-next-line no-await-in-loop
      await spawnComputePrizePoolPrizesProcess(network[0], network[1], outDir)
      core.setOutput('runStatus', 'true')
    }
  }
}
