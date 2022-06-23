import {
  Contract,
  ContractList,
  ContractType,
  getContractsByType,
  PrizePool,
  sortContractsByChainId,
} from '@pooltogether/v4-client-js';
import * as ethers from '@ethersproject/contracts';

import getProvider from './getProvider';

export function getContracts(
  chainId: string,
  contractType: ContractType,
  network: ContractList,
): Contract[] {
  try {
    const contract = getContractsByType(
      network.contracts as Contract[],
      contractType,
      network.version,
    );

    const contracts = sortContractsByChainId(contract);

    return contracts[Number(chainId)];
  } catch {
    throw new Error(`Contract ${contractType} not found for chainId ${chainId}`);
  }
}

export function getContract(
  chainId: string,
  contractType: ContractType,
  network: ContractList,
): Contract {
  const contracts = getContracts(chainId, contractType, network);

  return contracts[0];
}

export const getPrizeConfigHistoryContract = async (
  chainId: string,
  network: ContractList,
): Promise<any> => {
  const { address, abi } = getContracts(chainId, ContractType.PrizeConfigHistory, network)[0];

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
    const prizePoolContracts = getContracts(chainId, ContractType.PrizePool, network);

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
      getContract(chainId, ContractType.YieldSourcePrizePool, network),
      getProvider(chainId),
      network.contracts as unknown as Contract[],
    );
  }

  return prizePool;
};
