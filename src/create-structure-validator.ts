import { CreateCustomError } from '.'
import { processFactory } from './process'
import { Additional, EmitStructureValidation, Schema } from './types'

export function createStructureValidator<TErrors>(cb: CreateCustomError<TErrors>) {
  return function structureValidator<InputType, TSchema extends Schema<InputType> = Schema<InputType>>(
    schema: TSchema,
  ): TSchema & EmitStructureValidation<TErrors> {
    const emitStructureValidator = (
      input: unknown,
      preAdditional: Additional,
    ): ReturnType<EmitStructureValidation<TErrors>> => {
      const additional = { handleErrors: this.handleErrors, ...preAdditional }
      return processFactory(schema, input, additional, cb)
    }

    Object.entries(schema).forEach(([schemaKey, schemaValue]) => {
      Object.defineProperty(emitStructureValidator, schemaKey, { value: schemaValue, writable: true, enumerable: true })
    })

    return emitStructureValidator as TSchema & EmitStructureValidation<TErrors>
  }
}
