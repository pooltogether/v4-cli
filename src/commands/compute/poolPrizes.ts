import * as core from '@actions/core';
import { Command, Flags } from '@oclif/core';
import { mainnet, prizePoolNetworkTestnet } from '@pooltogether/v4-pool-data';

import getNewestPrizeDistributionDrawId from '../../lib/helpers/getNewestPrizeDistributionDrawId';
import findMostRecentDrawCommitedForChainId from '../../lib/helpers/findMostRecentDrawCommitedForChainId';
import spawnComputeDrawPrizesProcess from '../../lib/workers/spawnComputeDrawPrizesProcess';
import { isTestnet } from '../../lib/utils';

export default class PoolPrizes extends Command {
  static description =
    'Computes all historical Draw prizes for a PrizePool to a target output directory.';

  static examples = [];

  static flags = {
    version: Flags.string({
      char: 'v',
      description: 'Version (1 for genesis Prize Pool network, 2 for Tokenomics network)',
      required: false,
    }),
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
  };

  static args = [];

  public async catch(error: Record<string, any>): Promise<void> {
    core.setOutput('poolPrizes error', error);
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(PoolPrizes);
    const { chainId, ticket, outDir, version } = flags;

    const isTestNetwork = isTestnet(chainId);
    const network = isTestNetwork ? prizePoolNetworkTestnet : mainnet;

    const newestPrizeDistributionDrawId = await getNewestPrizeDistributionDrawId(chainId, network, version);

    const mostRecentCommitedDrawId = findMostRecentDrawCommitedForChainId(
      outDir,
      chainId,
      ticket,
      version,
    );

    const runRequired = mostRecentCommitedDrawId.toString() !== newestPrizeDistributionDrawId.toString();

    if (runRequired) {
      const draws = Array.from(
        { length: newestPrizeDistributionDrawId - mostRecentCommitedDrawId },
        (v, k) => k + mostRecentCommitedDrawId + 1,
      );

      for (const drawId of draws) {
        console.log(
          `Computing Draw prizes for drawId: ${drawId} on chainId: ${chainId} using ticket: ${ticket}`,
        );

        try {
          // eslint-disable-next-line no-await-in-loop
          await spawnComputeDrawPrizesProcess(chainId, drawId, ticket, outDir, version);
        } catch {
          // It may error if the draw is expired so we want to skip it and continue
          continue;
        }
      }

      core.setOutput('runStatus', 'true');
      core.setOutput('drawIds', JSON.stringify(draws));
    }
  }
}
