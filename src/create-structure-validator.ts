import { processFactory } from './process'
import { Additional, EmitStructureValidation, ErrorTree, ProcessResult, Schema } from './types'

type StructureValidatorCbParams<Type> = ProcessResult & {
  input: unknown
  inputName?: string
  schema: Schema<Type>
}

export type EmitStructureValidator = (input: unknown, additional?: Additional) => ErrorTree

export function createStructureValidator(
  cb: <InputType>(processResult: StructureValidatorCbParams<InputType>) => ErrorTree,
) {
  return function structureValidator<InputType, TSchema extends Schema<InputType> = Schema<InputType>>(
    schema: TSchema,
  ): TSchema & EmitStructureValidation {
    const emitStructureValidator = (input: unknown, preAdditional: Additional): ReturnType<EmitStructureValidation> => {
      const additional = { handleErrors: this.handleErrors, ...preAdditional }
      const processResult = processFactory(schema, input, additional)

      return cb({
        ...processResult,
        ...additional,
        errorTree: processResult.errorTree,
        input,
        schema,
      })
    }

    Object.entries(schema).forEach(([schemaKey, schemaValue]) => {
      Object.defineProperty(emitStructureValidator, schemaKey, { value: schemaValue, writable: true, enumerable: true })
    })

    return emitStructureValidator as TSchema & EmitStructureValidation
  }
}
