import { Command, Flags } from '@oclif/core';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@pooltogether/contract-list-schema';
import { ContractType, PrizeDistributorV1, PrizeDistributorV2 } from '@pooltogether/v4-client-js';
import { mainnet, testnet, tokenomicsTestnet } from '@pooltogether/v4-pool-data';

import getUserAccountsFromSubgraphForTicket from '../../lib/network/getUserAccountsFromSubgraphForTicket';
import {
  runCalculateDrawResultsWorkerV1,
  runCalculateDrawResultsWorkerV2,
} from '../../lib/workers/createWorkers';

import getDraw from '../../lib/helpers/getDraw';
import {
  getUsersBalance,
  filterUsersBalance,
  normalizeUsersBalance,
} from '../../lib/helpers/getUserBalance';

import createStatus from '../../lib/utils/createStatus';
import updateStatusFailure from '../../lib/utils/updateStatusFailure';
import updateStatusSuccess from '../../lib/utils/updateStatusSuccess';
import getProvider from '../../lib/utils/getProvider';
import isTestnet from '../../lib/utils/isTestnet';
import createOutputPath from '../../lib/utils/createOutputPath';
import createExitCode from '../../lib/utils/createExitCode';
import writeToOutput from '../../lib/utils/writeToOutput';
import writePrizesToOutput from '../../lib/utils/writePrizesToOutput';
import { verifyAgainstSchema } from '../../lib/utils/verifyAgainstSchema';
import {
  getContract,
  getPrizeConfigHistoryContract,
  getPrizePoolContract,
  sumPrizeAmounts,
} from '../../lib/utils';

/**
 * @name DrawPrizes
 */
export default class DrawPrizes extends Command {
  static description = 'Computes single Draw prizes for a PrizePool to a target output directory.';
  static examples = [
    `$ ptv4 compute drawPrizes --chainId 1 --drawId 1 --ticket 0x0000000000000000000000000000000000000000 --outDir ./temp/calculate
  Running compute:drawPrizes on chainId: 1 using drawID: 1
  `,
  ];

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
  };

  static args = [];
  static statusLoading = createStatus();

  public async catch(error: Error): Promise<any> {
    console.log(error, '_error drawPrizes');

    const { flags } = await this.parse(DrawPrizes);
    const { chainId, drawId, outDir, version } = flags;

    const isTestNetwork = isTestnet(chainId);
    const testNetworkVersion = version === '2' ? tokenomicsTestnet : testnet;
    const network = isTestNetwork ? testNetworkVersion : mainnet;

    const prizeDistributorContract = getContract(chainId, ContractType.PrizeDistributor, network);

    this.warn('Failed to calculate Draw Prizes (' + error + ')');

    const statusFailure = updateStatusFailure(DrawPrizes.statusLoading.createdAt, error);
    const outDirWithSchema = createOutputPath(
      outDir,
      chainId,
      prizeDistributorContract.address,
      drawId,
    );

    writeToOutput(outDirWithSchema, 'status', statusFailure);
    createExitCode(error, this);
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(DrawPrizes);
    const { chainId, drawId, ticket, outDir, version } = flags;

    this.log(`Running "calculate:prizes" on chainId: ${chainId} using drawID: ${drawId}`);

    const isTestNetwork = isTestnet(chainId);
    const testNetworkVersion = version === '2' ? tokenomicsTestnet : testnet;
    const network = isTestNetwork ? testNetworkVersion : mainnet;

    const ContractPrizeDistributor = getContract(chainId, ContractType.PrizeDistributor, network);

    const prizePool = await getPrizePoolContract(ticket, chainId, network, version);

    const outDirWithSchema = createOutputPath(
      outDir,
      chainId,
      ContractPrizeDistributor.address.toLowerCase(),
      drawId,
    );

    writeToOutput(outDirWithSchema, 'status', DrawPrizes.statusLoading);

    const ContractTicket = await prizePool.getTicketContract();

    if (version === '2') {
      const prizeDistributorV2 = new PrizeDistributorV2(
        ContractPrizeDistributor,
        getProvider(chainId),
        network.contracts as unknown as Contract[],
      );

      const drawCalculator = await prizeDistributorV2.getDrawCalculatorContract();
      const prizeConfigHistory = await getPrizeConfigHistoryContract(chainId, network);

      const draw = await getDraw(prizeDistributorV2, drawId);
      const prizeConfig = await prizeConfigHistory.callStatic.getPrizeConfig(drawId);

      const drawStartTimestamp = draw.timestamp - draw.beaconPeriodSeconds;
      const drawEndTimestamp = draw.timestamp - prizeConfig.endTimestampOffset;

      const totalPicks = await drawCalculator.callStatic.getTotalPicks(
        ticket,
        drawStartTimestamp,
        drawEndTimestamp,
        prizeConfig.poolStakeCeiling,
        prizeConfig.bitRangeSize,
        prizeConfig.matchCardinality,
      );

      const ticketTotalSupplies: BigNumber[] = await ContractTicket.getAverageTotalSuppliesBetween(
        [drawStartTimestamp],
        [drawEndTimestamp],
      );

      const userAccounts = await getUserAccountsFromSubgraphForTicket(
        chainId,
        ticket,
        drawStartTimestamp,
        drawEndTimestamp,
      );

      const usersBalance = getUsersBalance(
        userAccounts,
        ticket,
        drawStartTimestamp,
        drawEndTimestamp,
      );

      const filteredUsersBalance = filterUsersBalance(usersBalance);
      const normalizedUsersBalance = normalizeUsersBalance(
        filteredUsersBalance,
        ticketTotalSupplies[0],
      );

      const prizes = await runCalculateDrawResultsWorkerV2(
        ticket,
        drawCalculator,
        normalizedUsersBalance,
        prizeConfig,
        draw,
        BigNumber.from(drawId),
        totalPicks,
      );

      const _flatPrizes = prizes.flat(1);
      !verifyAgainstSchema(_flatPrizes) &&
        this.error('Prizes DataStructure is not valid against schema');

      writeToOutput(outDirWithSchema, 'prizes', _flatPrizes);
      writePrizesToOutput(outDirWithSchema, prizes);

      const statusSuccess = updateStatusSuccess(DrawPrizes.statusLoading.createdAt, {
        prizeLength: _flatPrizes.length,
        amountsTotal: sumPrizeAmounts(_flatPrizes),
      });

      writeToOutput(outDirWithSchema, 'status', statusSuccess);
    } else {
      const prizeDistributorV1 = new PrizeDistributorV1(
        ContractPrizeDistributor,
        getProvider(chainId),
        network.contracts as unknown as Contract[],
      );

      const draw = await getDraw(prizeDistributorV1, drawId);
      const prizeDistribution = await prizeDistributorV1.getPrizeDistribution(Number(drawId));

      const drawStartTimestamp = draw.timestamp - prizeDistribution.startTimestampOffset;
      const drawEndTimestamp = draw.timestamp - prizeDistribution.endTimestampOffset;

      const ticketTotalSupplies: BigNumber[] = await ContractTicket.getAverageTotalSuppliesBetween(
        [drawStartTimestamp],
        [drawEndTimestamp],
      );

      const userAccounts = await getUserAccountsFromSubgraphForTicket(
        chainId,
        ticket,
        drawStartTimestamp,
        drawEndTimestamp,
      );

      const usersBalance = getUsersBalance(
        userAccounts,
        ticket,
        drawStartTimestamp,
        drawEndTimestamp,
      );

      const filteredUsersBalance = filterUsersBalance(usersBalance);
      const normalizedUsersBalance = normalizeUsersBalance(
        filteredUsersBalance,
        ticketTotalSupplies[0],
      );

      const prizes = await runCalculateDrawResultsWorkerV1(
        normalizedUsersBalance,
        prizeDistribution,
        draw,
      );

      const _flatPrizes = prizes.flat(1);
      !verifyAgainstSchema(_flatPrizes) &&
        this.error('Prizes DataStructure is not valid against schema');

      writeToOutput(outDirWithSchema, 'prizes', _flatPrizes);
      writePrizesToOutput(outDirWithSchema, prizes);

      const statusSuccess = updateStatusSuccess(DrawPrizes.statusLoading.createdAt, {
        prizeLength: _flatPrizes.length,
        amountsTotal: sumPrizeAmounts(_flatPrizes),
      });

      writeToOutput(outDirWithSchema, 'status', statusSuccess);
    }
  }
}
