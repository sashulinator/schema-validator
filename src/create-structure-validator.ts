import { isObject, StructureAssertion } from '.'
import createStructureValidatorEmitter from './create-structure-validator-emitter'
import { ErrorCollector, Schema } from './types'
import passContextToEmitter from './lib/wrap-simple-assertion'

export function createStructureValidator<TErrors>(structureAssertion?: StructureAssertion) {
  return function structureValidator<TSchema extends Schema<any>>(schema: TSchema): TSchema & ErrorCollector<TErrors> {
    const newSchema = isObject(schema) ? {} : (schema as any)

    const structureValidatorEmitter = createStructureValidatorEmitter(newSchema, structureAssertion, this?.handleError)

    if (isObject(schema)) {
      Object.entries(schema).forEach(([schemaKey, schemaValue]) => {
        newSchema[schemaKey] = passContextToEmitter(this, schemaValue, schemaKey, structureValidatorEmitter)

        Object.defineProperty(structureValidatorEmitter, schemaKey, {
          value: newSchema[schemaKey],
          writable: true,
          enumerable: true,
        })
      })
    }

    return structureValidatorEmitter as TSchema & ErrorCollector<TErrors>
  }
}
