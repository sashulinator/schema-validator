import { ValidateStructure } from '.'
import { processFactory } from './process'
import { Meta, EmitStructureValidation, Schema } from './types'

export function createStructureValidator<TErrors>(validateStructure?: ValidateStructure<TErrors>) {
  return function structureValidator<InputType, TSchema extends Schema<InputType> = Schema<InputType>>(
    schema: TSchema,
  ): TSchema & EmitStructureValidation<TErrors> {
    function emitStructureValidator(input: unknown, meta: Meta): ReturnType<EmitStructureValidation<TErrors>> {
      if (!this?.handleError) {
        throw new Error('"handleError" is not provided!')
      }

      const newMeta = { path: '', handleError: this.handleError, ...meta }

      const structureError = validateStructure?.(schema, input, meta)

      const errors = processFactory(schema, input, newMeta)

      if (errors || structureError) {
        return this.handleError(errors, structureError, newMeta)
      }

      return undefined
    }

    Object.entries(schema).forEach(([schemaKey, schemaValue]) => {
      Object.defineProperty(emitStructureValidator, schemaKey, { value: schemaValue, writable: true, enumerable: true })
    })

    return emitStructureValidator as TSchema & EmitStructureValidation<TErrors>
  }
}

export const wrap = createStructureValidator()
