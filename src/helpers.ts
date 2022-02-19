import { CreateCustomError } from '.'
import { processFactory } from './process'
import { Meta, EmitStructureValidation, Schema } from './types'

export function createStructureValidator<TErrors>(
  handleErrors: CreateCustomError<TErrors>,
  cb?: CreateCustomError<TErrors>,
) {
  return function structureValidator<InputType, TSchema extends Schema<InputType> = Schema<InputType>>(
    schema: TSchema,
  ): TSchema & EmitStructureValidation<TErrors> {
    const emitStructureValidator = (input: unknown, meta: Meta): ReturnType<EmitStructureValidation<TErrors>> => {
      const newMeta = { path: '', handleErrors, ...meta }
      return processFactory(schema, input, newMeta, cb)
    }

    Object.entries(schema).forEach(([schemaKey, schemaValue]) => {
      Object.defineProperty(emitStructureValidator, schemaKey, { value: schemaValue, writable: true, enumerable: true })
    })

    return emitStructureValidator as TSchema & EmitStructureValidation<TErrors>
  }
}

export function addPropertiesToFunction<
  Obj extends Record<string, unknown>,
  Func extends (...args: unknown[]) => unknown
>(obj: Obj, fn: Func): Func & Obj {
  Object.entries(obj).forEach(([key, value]) => {
    Object.defineProperty(fn, key, { value, writable: true, enumerable: true })
  })

  return fn as Func & Obj
}
