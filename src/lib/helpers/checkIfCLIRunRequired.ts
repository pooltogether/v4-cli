import {mkdirSync} from 'node:fs'
import findMostRecentDrawCommitedForChainId from './findMostRecentDrawCommitedForChainId'
import getNewestPrizeDistribution from './getNewestPrizeDistribution'

async function checkIfCLIRunRequired(path: string, chainId: string, ticket: string): Promise<boolean> {
  mkdirSync(path, {recursive: true})
  const mostRecentCommit = findMostRecentDrawCommitedForChainId(path, chainId, ticket)
  const newestPrizeDistributionDrawId = (await getNewestPrizeDistribution(chainId)).drawId
  const runRequired = mostRecentCommit.toString() !== newestPrizeDistributionDrawId.toString()
  return runRequired
}

export default checkIfCLIRunRequired
