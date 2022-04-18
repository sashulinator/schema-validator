import { isObject, ValidateStructure, ValidationError } from '.'
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

export const only = createStructureValidator((schema, input, meta) => {
  if (isObject(input)) {
    const schemaEntries = Object.entries(schema)
    let inputKeys = Object.keys(input)

    for (let index = 0; index < schemaEntries.length; index += 1) {
      const [schemaKey] = schemaEntries[index]

      inputKeys = inputKeys.filter((inputKey) => inputKey !== schemaKey)
    }

    if (inputKeys.length) {
      return new ValidationError({
        inputName: meta?.inputName,
        input: inputKeys,
        code: 'excessiveKeys',
        message: 'some keys are excessive',
      })
    }
  }

  return undefined
})
