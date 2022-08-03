import util from 'node:util';
import { exec as _exec } from 'node:child_process';
import { resolve } from 'node:path';
const exec = util.promisify(_exec);

async function spawnComputeDrawPrizesProcess(
  chainId: string,
  drawId: number,
  ticket: string,
  outDir: string,
  version = '1',
): Promise<string> {
  const path = resolve(__dirname, '../../../bin/run');

  const { stdout, stderr } = await exec(
    `${path} compute drawPrizes --version ${version} --chainId ${chainId} --drawId ${drawId} --ticket ${ticket} --outDir ${outDir}`,
  );

  if (stderr) {
    return stderr;
  }

  return stdout;
}

export default spawnComputeDrawPrizesProcess;
