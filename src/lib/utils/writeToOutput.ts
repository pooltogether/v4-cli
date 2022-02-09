// eslint-disable-next-line unicorn/prefer-node-protocol
import {writeFileSync, mkdirSync} from 'fs'
type File = any

function writeToOutput(
  outputDir: string,
  fileName: string,
  blob: File,
): void {
  mkdirSync(outputDir, {recursive: true})
  const outputFilePath = `${outputDir}/${fileName}.json`
  writeFileSync(outputFilePath, JSON.stringify(blob, null, 2))
}

export default writeToOutput
