import writeToOutput from './writeToOutput'

export function writeStatus(outputDir: string, json: any): void {
  writeToOutput(outputDir, 'status', json)
}

export default writeStatus
