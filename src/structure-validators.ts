import { processOrEmit, ProcessResult } from './process'
import { ValidationError } from './errors'
import { ErrorTree, Schema, Structure } from './types'

type StructureValidatorCbParams = ProcessResult & {
  structure: Structure
  schema: Schema
  isThrowError: boolean
  key: string
}

export function createStructureValidator(
  cb: (processResult: StructureValidatorCbParams) => ErrorTree,
  initialKey?: string,
) {
  return <SC extends Schema>(schema: SC): SC => {
    function emitStructureValidator(structure: Structure, key = initialKey, isThrowError: boolean) {
      return cb({ ...processOrEmit(schema, structure, key), structure, schema, isThrowError, key })
    }

    const schemaKeys = Object.keys(schema)

    for (let index = 0; index < schemaKeys.length; index += 1) {
      const key = schemaKeys[index]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.defineProperty(test, key, { value: schema[key], writable: true })
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return emitStructureValidator
  }
}

export const only = createStructureValidator(({ errorTree, unusedObjectKeys, key }) => {
  if (unusedObjectKeys.length) {
    const excessiveKeysError = new ValidationError({
      key,
      value: unusedObjectKeys,
      code: 'excessiveKeys',
      message: 'some keys are excessive',
    })

    errorTree = { ...excessiveKeysError, ...errorTree }
  }

  return errorTree
})

export const required = createStructureValidator(({ errorTree, unusedSchemaKeys, key }) => {
  if (unusedSchemaKeys.length) {
    const requiredKeysError = new ValidationError({
      key,
      value: unusedSchemaKeys,
      code: 'requiredKeys',
      message: 'some keys are required',
    })

    errorTree = { ...requiredKeysError, ...errorTree }
  }

  return errorTree
})

export const requiredOnly = <S extends Schema>(schema: S): S => only(required(schema))
