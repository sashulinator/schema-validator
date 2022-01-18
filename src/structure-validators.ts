import { processOrEmit, ProcessResult } from './process'
import { ValidationError } from './errors'
import { EmitStructureValidation, ErrorTree, Schema, Structure } from './types'
import { removeEmpty } from './remove-empty'

type StructureValidatorCbParams = ProcessResult & {
  structure: Structure
  parentStructure?: Structure
  schema: Schema
  key: string
}

export function createStructureValidator(
  cb: (processResult: StructureValidatorCbParams) => ErrorTree,
  initialKey?: string,
) {
  return <SC extends Schema>(schema: SC): SC & EmitStructureValidation => {
    function emitStructureValidator(structure: Structure, key = initialKey, parentStructure?: Structure) {
      const processResult = processOrEmit(schema, structure, key, parentStructure)

      return cb({
        ...processResult,
        errorTree: removeEmpty(processResult.errorTree),
        structure,
        schema,
        key,
        parentStructure,
      })
    }

    const schemaKeys = Object.keys(schema)

    for (let index = 0; index < schemaKeys.length; index += 1) {
      const key = schemaKeys[index]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.defineProperty(emitStructureValidator, key, { value: schema[key], writable: true })
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return emitStructureValidator
  }
}

export const wrap = createStructureValidator(({ errorTree }) => errorTree)

export const notEmpty = createStructureValidator(({ errorTree, structure, key }) => {
  const isEmpty = Array.isArray(structure) ? structure.length === 0 : Object.keys(structure).length === 0

  if (isEmpty) {
    const type = Array.isArray(structure) ? 'array' : 'object'

    const excessiveKeysError = new ValidationError({
      key,
      code: `${type}Empty`,
      message: `${type} cannot be empty`,
    })

    errorTree = { ...excessiveKeysError, ...errorTree }
  }

  return errorTree
})

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
