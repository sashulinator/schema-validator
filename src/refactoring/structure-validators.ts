import { ValidationError } from './errors'
import { processFactory } from './process'
import { removeEmpty } from './remove-empty'
import { Additional, EmitStructureValidation, ErrorTree, ProcessResult, Schema } from './types'

type StructureValidatorCbParams<Type> = ProcessResult & {
  input: unknown
  inputName?: string
  schema: Schema<Type>
}

export type EmitStructureValidator = (input: unknown, additional: Additional) => ErrorTree

export function createStructureValidator(
  cb: <InputType>(processResult: StructureValidatorCbParams<InputType>) => ErrorTree,
) {
  return function test<InputType, SC extends Schema<InputType> = Schema<InputType>>(
    schema: SC,
  ): SC & EmitStructureValidation {
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

export const wrap = createStructureValidator(({ errorTree, unusedObjectKeys, inputName }) => {
  return errorTree
})
