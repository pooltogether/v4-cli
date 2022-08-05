import {Prize} from '@pooltogether/v4-utils-js'
import writeToOutput from './writeToOutput'

function writePrizesToOutput(
  outDir: string,
  allPrizes: Prize[][],
): void {
  for (const depositorPrizes of allPrizes) {
    const address = depositorPrizes[0].address.toLowerCase()
    writeToOutput(outDir, address.toLowerCase(), depositorPrizes)
  }
}

export default writePrizesToOutput
