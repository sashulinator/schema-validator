import { CreateCustomError } from '.'
import { processFactory } from './process'
import { Meta, EmitStructureValidation, Schema } from './types'

export function createStructureValidator<TErrors>(createCustomError?: CreateCustomError<TErrors>) {
  return function structureValidator<InputType, TSchema extends Schema<InputType> = Schema<InputType>>(
    schema: TSchema,
  ): TSchema & EmitStructureValidation<TErrors> {
    function emitStructureValidator(input: unknown, meta: Meta): ReturnType<EmitStructureValidation<TErrors>> {
      if (!this?.handleError) {
        throw new Error('"handleError" is not provided!')
      }

      const newMeta = { path: '', handleError: this.handleError, ...meta }

      return processFactory(schema, input, newMeta, createCustomError)
    }

    Object.entries(schema).forEach(([schemaKey, schemaValue]) => {
      Object.defineProperty(emitStructureValidator, schemaKey, { value: schemaValue, writable: true, enumerable: true })
    })

    return emitStructureValidator as TSchema & EmitStructureValidation<TErrors>
  }
}

export const wrap = createStructureValidator()
