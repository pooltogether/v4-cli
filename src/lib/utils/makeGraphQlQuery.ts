import { request, gql } from 'graphql-request';

import getSubgraphUrlForNetwork from '../utils/getSubgraphUrlForNetwork';
import isNewSubgraph from './isNewSubgraph';

const buildQueryString = (
  chainId: string,
  _ticket: string,
  drawStartTime: number,
  drawEndTime: number,
  maxPageSize: number,
  lastId: string,
) => {
  let queryString = `{
    ticket(id: "${_ticket}") {
      accounts(first: ${maxPageSize} , where: {
        id_gt: "${lastId}"
      }) {
        id
        delegateBalance

        # get twab beforeOrAt drawStartTime
        beforeOrAtDrawStartTime: twabs(
          orderBy: timestamp
          orderDirection: desc
          first: 1
          where: { timestamp_lte: ${drawStartTime} } #drawStartTime
        ) {
          amount
          timestamp
          delegateBalance
        }

        # now get twab beforeOrAt drawEndTime (may be the same as above)
        beforeOrAtDrawEndTime: twabs(
          orderBy: timestamp
          orderDirection: desc
          first: 1
          where: { timestamp_lte: ${drawEndTime} } #drawEndTime
        ) {
          amount
          timestamp
          delegateBalance
        }
      }
    }
  }`;

  if (isNewSubgraph(chainId)) {
    queryString = `{
      ticket(id: "${_ticket}") {
        accounts(first: ${maxPageSize} , where: {
          id_gt: "${lastId}"
        }) {
          id
          address
          delegateBalance

          # get twab beforeOrAt drawStartTime
          beforeOrAtDrawStartTime: twabs(
            orderBy: timestamp
            orderDirection: desc
            first: 1
            where: { timestamp_lte: ${drawStartTime} } #drawStartTime
          ) {
            amount
            timestamp
            delegateBalance
          }

          # now get twab beforeOrAt drawEndTime (may be the same as above)
          beforeOrAtDrawEndTime: twabs(
            orderBy: timestamp
            orderDirection: desc
            first: 1
            where: { timestamp_lte: ${drawEndTime} } #drawEndTime
          ) {
            amount
            timestamp
            delegateBalance
          }
        }
      }
    }`;
  }

  return queryString;
};

export async function makeGraphQlQuery(
  chainId: string,
  _ticket: string,
  drawStartTime: number,
  drawEndTime: number,
): Promise<any> {
  const subgraphURL = getSubgraphUrlForNetwork(chainId);

  const maxPageSize = 1000;
  let lastId = '';

  let data;
  const results = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const queryString = buildQueryString(chainId, _ticket, drawStartTime, drawEndTime, maxPageSize, lastId);

    const query = gql`
      ${queryString}
    `;

    // eslint-disable-next-line no-await-in-loop
    data = await request(subgraphURL, query);

    results.push(data.ticket.accounts);

    const numberOfResults = data.ticket.accounts.length;
    if (numberOfResults < maxPageSize) {
      // we have gotten all the results
      break;
    }

    lastId = data.ticket.accounts[data.ticket.accounts.length - 1].id;
  }

  return results.flat(1);
}

export default makeGraphQlQuery;
