import { Assertion, isObject, StructureValidator } from '.'
import createStructureValidatorEmitter from './create-structure-validator-emitter'
import { emitAssertion } from './emit-assertion'
import { Meta, ErrorCollector, Schema } from './types'

export function createStructureValidator<TErrors>(validateStructure?: StructureValidator<TErrors>) {
  return function structureValidator<TSchema extends Schema<any>>(schema: TSchema): TSchema & ErrorCollector<TErrors> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const newSchema = isObject(schema) ? {} : (schema as any)

    const structureValidatorEmitter = createStructureValidatorEmitter(schema, validateStructure, this?.handleError)

    if (isObject(schema)) {
      Object.entries(schema).forEach(([schemaKey, schemaValue]: [string, Assertion]) => {
        newSchema[schemaKey] = schemaValue

        if (typeof schemaValue === 'function') {
          newSchema[schemaKey] = (input: unknown, meta: Meta) => {
            if (structureValidatorEmitter.name === schemaValue.name) {
              return emitAssertion(schemaValue.bind(that), input, { ...meta, inputName: schemaKey })
            }

            return emitAssertion(schemaValue, input, { ...meta, inputName: schemaKey })
          }
        }

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

export const buildObjectByPath = (
  obj: Record<string, unknown>,
  pathString: string,
  value: any = null,
): Record<string, unknown> => {
  let paths = pathString.split('.')
  let current = obj
  while (paths.length > 1) {
    const [head, ...tail] = paths
    paths = tail
    if (current[head] === undefined) {
      current[head] = {}
    }
    current = current[head] as Record<string, unknown>
  }
  if (value) {
    const oldValue = current[paths[0]] as any
    current[paths[0]] = { ...oldValue, ...value }
  }
  return obj
}
