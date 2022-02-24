// @ts-nocheck
import fs, {mkdirSync} from 'node:fs'
import {resolve} from 'node:path'
import getPrizeDistributorAddress from './getPrizeDistributorAddress'

function findMostRecentDrawCommitedForChainId(path: string, chainId: any, ticket: any): any {
  const prizeDistributor = getPrizeDistributorAddress(chainId, ticket)
  const drawsPath = `${path}/${chainId}/${prizeDistributor.toLowerCase()}/draw`
  mkdirSync(drawsPath, {recursive: true})
  const draws = fs.readdirSync(resolve(drawsPath))
  const maxDraw = draws.reduce((a, b) => {
    return Math.max(a, b)
  }, 0)
  return maxDraw
}

export default findMostRecentDrawCommitedForChainId
