import { ValidationError } from './errors'
import { processFactory } from './process'
import { removeEmpty } from './remove-empty'
import { Additional, EmitStructureValidation, ErrorTree, ProcessResult, Schema } from './types'

type StructureValidatorCbParams = ProcessResult & {
  input: unknown
  inputName?: string
  schema: Schema
}

export type EmitStructureValidator = (input: unknown, additional: Additional) => ErrorTree

export function createStructureValidator(cb: (processResult: StructureValidatorCbParams) => ErrorTree) {
  return <SC extends Schema>(schema: SC): SC & EmitStructureValidation => {
    const emitStructureValidator: EmitStructureValidator = (input, additional) => {
      const processResult = processFactory(schema, input, additional)

      return cb({
        ...processResult,
        ...additional,
        errorTree: removeEmpty(processResult.errorTree),
        input,
        schema,
      })
    }

    Object.entries(schema).forEach(([schemaKey, schemaValue]) => {
      Object.defineProperty(emitStructureValidator, schemaKey, { value: schemaValue, writable: true, enumerable: true })
    })

    return emitStructureValidator as SC & EmitStructureValidation
  }
}

export const only = createStructureValidator(({ errorTree, unusedObjectKeys, inputName }) => {
  if (unusedObjectKeys.length) {
    const excessiveKeysError = new ValidationError({
      inputName,
      input: unusedObjectKeys,
      code: 'excessiveKeys',
      message: 'some keys are excessive',
    })

    errorTree = { ...excessiveKeysError, ...errorTree }
  }

  return errorTree
})
