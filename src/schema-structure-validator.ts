import { ValidationError } from './errors'
import { createStructureValidator } from './create-structure-validator'
import {
  isObject,
  EmitStructureValidation,
  CreateCustomError,
  Schema,
  processFactory,
  Meta,
  isEmpty,
  addPropertiesToFunction,
} from '.'

export class SchemaStructureValidator<
  THandleErrors extends (errors: any, validationError?: ValidationError) => any,
  TCreateCustomErrors extends Record<string, CreateCustomError<ValidationError>>
> {
  private readonly handleErrors: THandleErrors

  custom: Record<
    keyof TCreateCustomErrors,
    <TSchema extends Schema<any>>(schema: TSchema) => TSchema & EmitStructureValidation<ReturnType<THandleErrors>>
  >

  constructor({ handleErrors, custom }: { handleErrors: THandleErrors; custom?: TCreateCustomErrors }) {
    this.handleErrors = handleErrors
    this.createCustomeValidationEmitter(custom)
  }

  private createCustomeValidationEmitter(custom: TCreateCustomErrors) {
    if (!custom) return

    this.custom = {} as Record<keyof TCreateCustomErrors, EmitStructureValidation<any>>
    const customEntries = Object.entries(custom)

    for (let index = 0; index < customEntries.length; index += 1) {
      const [key, value] = customEntries[index] as [keyof TCreateCustomErrors, CreateCustomError<any>]
      this.custom[key] = createStructureValidator(this.handleErrors, value)
    }
  }

  public wrap = <TSchema extends Schema<any>>(
    schema: TSchema,
  ): TSchema & EmitStructureValidation<ReturnType<THandleErrors>> => {
    return createStructureValidator(this.handleErrors)(schema)
  }

  public or = <TSchema1 extends Schema<any>, TSchema2 extends Schema<any>>(
    schema1: TSchema1,
    schema2: TSchema2,
  ): TSchema1 & TSchema2 & EmitStructureValidation<ReturnType<THandleErrors>> => {
    const emitStructureValidator = (input: unknown, meta: Meta) => {
      const newMeta = { path: '', handleErrors: this.handleErrors, ...meta }
      const errors1 = processFactory(schema1, input, newMeta)
      const errors2 = processFactory(schema2, input, newMeta)
      const isErrors1Exists = errors1 !== undefined && !isEmpty(errors1)
      const isErrors2Exists = errors2 !== undefined && !isEmpty(errors2)

      if (isErrors1Exists && isErrors2Exists) {
        return errors1
      }
    }

    if (isObject(schema1)) {
      addPropertiesToFunction(schema1, emitStructureValidator)
    }
    if (isObject(schema2)) {
      addPropertiesToFunction(schema2, emitStructureValidator)
    }

    return emitStructureValidator as TSchema1 & TSchema2 & EmitStructureValidation<ReturnType<THandleErrors>>
  }

  public only = <TSchema extends Schema<any>>(
    gschema: TSchema,
  ): TSchema & EmitStructureValidation<ReturnType<THandleErrors>> => {
    return createStructureValidator(this.handleErrors, (schema, input, meta) => {
      if (isObject(input)) {
        const schemaEntries = Object.entries(schema)
        let inputKeys = Object.keys(input)

        for (let index = 0; index < schemaEntries.length; index += 1) {
          const [schemaKey] = schemaEntries[index]

          inputKeys = inputKeys.filter((inputKey) => inputKey !== schemaKey)
        }

        if (inputKeys.length) {
          return new ValidationError({
            inputName: meta.inputName,
            input: inputKeys,
            code: 'excessiveKeys',
            message: 'some keys are excessive',
          })
        }
      }

      return undefined
    })(gschema)
  }
}
