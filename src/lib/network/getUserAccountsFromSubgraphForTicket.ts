import {Account} from '@pooltogether/v4-utils-js'
import {makeGraphQlQuery} from '../utils/makeGraphQlQuery'
import {getSubgraphUrlForNetwork} from '../utils/getSubgraphUrlForNetwork'

export async function getUserAccountsFromSubgraphForTicket(
  chainId: string,
  ticket: string,
  drawStartTime: number,
  drawEndTime: number,
): Promise<Account[]> {
  const subgraphURL = getSubgraphUrlForNetwork(chainId)
  const _ticket = ticket.toLowerCase()

  // now call subgraph
  const allUserBalances = await makeGraphQlQuery(
    subgraphURL,
    _ticket,
    drawStartTime,
    drawEndTime,
  )

  return allUserBalances.flat(1) as Account[]
}
