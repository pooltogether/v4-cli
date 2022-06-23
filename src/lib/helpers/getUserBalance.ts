import { BigNumber } from '@ethersproject/bignumber';
import {
  Account,
  calculateUserBalanceFromAccount,
  calculateNormalizedUserBalancesFromTotalSupply,
  NormalizedUserBalance,
  UserBalance,
  utils,
} from '@pooltogether/v4-utils-js';

export const getUsersBalance = (
  accounts: Account[],
  ticket: string,
  drawStartTimestamp: number,
  drawEndTimestamp: number,
): any[] => {
  return accounts.map((account: Account) => {
    const balance = calculateUserBalanceFromAccount(account, drawStartTimestamp, drawEndTimestamp);

    if (!balance) {
      return;
    }

    return {
      balance,
      address: account.id.startsWith(ticket.toLowerCase()) ? account.address : account.id, // Retro compatible with old and new TWAB subgraph
    };
  });
};

export const filterUsersBalance = (usersBalance: UserBalance[]): UserBalance[] =>
  utils.filterUndefinedValues<UserBalance>(usersBalance);

export const normalizeUsersBalance = (
  filteredUsersBalance: UserBalance[],
  ticketPrimaryAverageTotalSupply: BigNumber,
): NormalizedUserBalance[] =>
  calculateNormalizedUserBalancesFromTotalSupply(
    filteredUsersBalance,
    ticketPrimaryAverageTotalSupply,
  );
