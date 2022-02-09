// @ts-nocheck
import util from 'node:util'
import {exec as _exec} from 'node:child_process'
import {resolve} from 'node:path'
const exec = util.promisify(_exec)

async function spawnComputeDrawPrizesProcess(chainId: string, drawId: number, ticket: string): Promise<void> {
  try {
    const path = resolve(__dirname, '../../../bin/run')
    const {stdout, stderr} = await exec(`${path} compute drawPrizes --chainId ${chainId} --drawId ${drawId} --ticket ${ticket} --outDir ./temp`)
    if (stderr) {
      console.log(stderr)
      return stderr
    }

    return stdout
  } catch (error) {
    console.error(error)
    return error
  }
}

export default spawnComputeDrawPrizesProcess
