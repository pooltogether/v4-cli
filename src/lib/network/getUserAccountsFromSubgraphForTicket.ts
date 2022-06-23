import makeGraphQlQuery from '../utils/makeGraphQlQuery'

async function getUserAccountsFromSubgraphForTicket(
  chainId: string,
  ticket: string,
  drawStartTime: number,
  drawEndTime: number,
): Promise<any[]> {
  const _ticket = ticket.toLowerCase()
  const allUserBalances = await makeGraphQlQuery(
    chainId,
    _ticket,
    drawStartTime,
    drawEndTime,
  )

  return allUserBalances.flat(1)
}

export default getUserAccountsFromSubgraphForTicket
