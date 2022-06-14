import fs, { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

import getPrizeDistributorAddress from './getPrizeDistributorAddress';

function findMostRecentDrawCommitedForChainId(path: string, chainId: string, ticket: string): number {
  const prizeDistributor = getPrizeDistributorAddress(chainId, ticket).toLowerCase();
  const drawsPath = `${path}/${chainId}/${prizeDistributor}/draw`;

  mkdirSync(drawsPath, { recursive: true });

  const draws = fs.readdirSync(resolve(drawsPath));

  // eslint-disable-next-line unicorn/no-array-reduce
  const maxDraw = draws.reduce((a, b) => {
    return Math.max(a, Number(b));
  }, 0);

  return maxDraw;
}

export default findMostRecentDrawCommitedForChainId;
