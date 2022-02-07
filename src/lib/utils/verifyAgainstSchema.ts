import schema from '@pooltogether/prize-api-schema/schema/prize.json'
import AJV from 'ajv'

export function verifyAgainstSchema(data: any): boolean {
  const ajv = new AJV()
  return ajv.validate(schema, data)
}

export default verifyAgainstSchema
