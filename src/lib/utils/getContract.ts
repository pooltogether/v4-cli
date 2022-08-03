import {
  Contract,
  ContractList,
  ContractType,
  getContractsByType,
  PrizePool,
  sortContractsByChainId,
  Version,
} from '@pooltogether/v4-client-js';
import * as ethers from '@ethersproject/contracts';

import getProvider from './getProvider';

export const defaultVersion: Version = { major: 1, minor: 0, patch: 0 };
export const secondVersion: Version = { major: 2, minor: 0, patch: 0 };

export const getContracts = async (
  chainId: string,
  contractType: ContractType,
  network: ContractList,
  contractVersion: Version = defaultVersion,
): Promise<Contract[]> => {
  try {
    const contracts = getContractsByType(
      network.contracts as Contract[],
      contractType,
      contractVersion,
    );

    const contractsSortedByChainId = sortContractsByChainId(contracts);

    return contractsSortedByChainId[Number(chainId)];
  } catch {
    throw new Error(`Contract ${contractType} not found for chainId ${chainId}`);
  }
};

export const getContract = async (
  chainId: string,
  contractType: ContractType,
  network: ContractList,
  contractVersion: Version = defaultVersion,
): Promise<Contract> => {
  const contracts = await getContracts(chainId, contractType, network, contractVersion);

  return contracts[0];
};

export const getDrawBufferContract = async (
  chainId: string,
  network: ContractList,
): Promise<any> => {
  const { address, abi } = await getContract(chainId, ContractType.DrawBuffer, network);

  return new ethers.Contract(address, abi, getProvider(chainId));
};

export const getPrizeConfigHistoryContract = async (
  chainId: string,
  network: ContractList,
): Promise<any> => {
  const { address, abi } = await getContract(chainId, ContractType.PrizeConfigHistory, network);

  return new ethers.Contract(address, abi, getProvider(chainId));
};

export const getPrizePoolContract = async (
  ticket: string,
  chainId: string,
  network: ContractList,
  version?: string,
): Promise<PrizePool> => {
  let prizePool: PrizePool;

  if (version === '2') {
    const prizePoolContracts = await getContracts(chainId, ContractType.PrizePool, network);

    const loopThroughPrizePoolContracts = async () => {
      for (const prizePoolContract of prizePoolContracts) {
        prizePool = new PrizePool(
          prizePoolContract,
          getProvider(chainId),
          network.contracts as unknown as Contract[],
        );

        // eslint-disable-next-line no-await-in-loop
        if ((await prizePool.getTicketContract()).address === ticket) {
          return prizePool;
        }
      }
    };

    prizePool = (await loopThroughPrizePoolContracts()) as PrizePool;
  } else {
    prizePool = new PrizePool(
      await getContract(chainId, ContractType.YieldSourcePrizePool, network),
      getProvider(chainId),
      network.contracts as unknown as Contract[],
    );
  }

  return prizePool;
};
