import { processFactory } from '.'
import { SchemaCollector } from './types'

export const or: SchemaCollector = (...schemas) => {
  return function emitSchemaCollector(input, meta) {
    let localErrors: any[]

    for (let index = 0; index < schemas.length; index += 1) {
      const schema = schemas[index]

      const error = processFactory(schema, input, meta)

      if (error) {
        localErrors.push(error)
      }
    }

    if (localErrors.length === schemas.length) {
      return localErrors[0]
    }
  }
}
