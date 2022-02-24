import * as schema from '@pooltogether/prize-api-schema/schema/prize.json'
import AJV from 'ajv'

type DataStructure = any

export function verifyAgainstSchema(data: DataStructure): boolean {
  const ajv = new AJV()
  return ajv.validate(schema, data)
}
