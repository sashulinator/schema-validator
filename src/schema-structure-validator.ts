import { ValidationError } from './errors'
import { createStructureValidator } from './create-structure-validator'
import { isObject, EmitStructureValidation, CreateCustomError, Schema } from '.'

export class SchemaStructureValidator<
  THandleErrors extends (errors: any, validationError?: ValidationError) => any,
  TCreateCustomErrors extends Record<string, CreateCustomError<ValidationError>>
> {
  private readonly handleErrors: THandleErrors

  readonly custom: Record<
    keyof TCreateCustomErrors,
    <TSchema extends Schema<any>>(schema: TSchema) => TSchema & EmitStructureValidation<ReturnType<THandleErrors>>
  >

  constructor({ handleErrors, custom }: { handleErrors: THandleErrors; custom?: TCreateCustomErrors }) {
    this.handleErrors = handleErrors

    if (custom) {
      this.custom = {} as Record<keyof TCreateCustomErrors, EmitStructureValidation<any>>
      const customEntries = Object.entries(custom)

      for (let index = 0; index < customEntries.length; index += 1) {
        const [key, value] = customEntries[index] as [keyof TCreateCustomErrors, CreateCustomError<any>]

        this.custom[key] = createStructureValidator(this.handleErrors, value)
      }
    }
  }

  public wrap = <TSchema extends Schema<any>>(
    schema: TSchema,
  ): TSchema & EmitStructureValidation<ReturnType<THandleErrors>> => {
    return createStructureValidator(this.handleErrors, () => undefined)(schema)
  }

  public only = <TSchema extends Schema<any>>(
    gschema: TSchema,
  ): TSchema & EmitStructureValidation<ReturnType<THandleErrors>> => {
    return createStructureValidator(this.handleErrors, (schema, input, additional) => {
      if (isObject(input)) {
        const schemaEntries = Object.entries(schema)
        let inputKeys = Object.keys(input)

        for (let index = 0; index < schemaEntries.length; index += 1) {
          const [schemaKey] = schemaEntries[index]

          inputKeys = inputKeys.filter((inputKey) => inputKey !== schemaKey)
        }

        if (inputKeys.length) {
          return new ValidationError({
            inputName: additional.inputName,
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
