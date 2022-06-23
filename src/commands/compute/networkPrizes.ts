import { Command, Flags } from '@oclif/core';
import * as core from '@actions/core';
import spawnComputePrizePoolPrizesProcess from '../../lib/workers/spawnComputePrizePoolPrizesProcess';
import {
  AVALANCHE_USDC_TICKET_ADDRESS,
  MAINNET_USDC_TICKET_ADDRESS,
  POLYGON_USDC_TICKET_ADDRESS,
} from '../../lib/constants';

export default class NetworkPrizes extends Command {
  static description =
    'Computes Draw prizes for all PoolTogether V4 network PrizePools to a target output directory.';

  static examples = [];

  static flags = {
    version: Flags.string({
      char: 'v',
      description: 'Version (1 for genesis Prize Pool network, 2 for Tokenomics network)',
      required: false,
    }),
    outDir: Flags.string({
      char: 'o',
      description: 'Output Directory',
      required: true,
    }),
  };

  static args = [];
  public async catch(error: Record<string, any>): Promise<void> {
    core.setOutput('networkPrizes error', error);
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(NetworkPrizes);
    const { outDir } = flags;
    const networks = [
      [1, MAINNET_USDC_TICKET_ADDRESS],
      [137, POLYGON_USDC_TICKET_ADDRESS],
      [43_114, AVALANCHE_USDC_TICKET_ADDRESS],
    ];
    for (const network of networks) {
      console.log(
        `Computing PrizePool prizes for chainId: ${network[0]} using ticket: ${network[1]}`,
      );
      // eslint-disable-next-line no-await-in-loop
      await spawnComputePrizePoolPrizesProcess(network[0], network[1], outDir);
      core.setOutput('runStatus', 'true');
    }
  }
}
