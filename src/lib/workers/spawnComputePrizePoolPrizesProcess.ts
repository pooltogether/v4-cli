import { resolve } from 'node:path';
import util from 'node:util';
import * as nodeChildProcess from 'node:child_process';
const exec = util.promisify(nodeChildProcess.exec);

async function spawnComputePrizePoolPrizesProcess(chainId: string | number, ticket: any, outDir: string): Promise<any> {
  try {
    const path = resolve(__dirname, '../../../bin/run');
    const { stdout, stderr } = await exec(`${path} compute poolPrizes --chainId ${chainId} --ticket ${ticket} --outDir ${outDir}`);
    if (stderr) {
      console.log(stderr);
      return stderr;
    }

    return stdout;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default spawnComputePrizePoolPrizesProcess;
