import { ValidationError } from './errors'
import { createStructureValidator } from './create-structure-validator'
import { isObject } from '.'

export class SchemaStructureValidator<THandleErrors extends (errors: any, validationError?: ValidationError) => any> {
  private readonly handleErrors: THandleErrors

  constructor({ handleErrors }: { handleErrors: THandleErrors }) {
    this.handleErrors = handleErrors
  }

  public wrap = createStructureValidator((): ReturnType<THandleErrors> => undefined)

  public only = createStructureValidator((schema, input: any, additional) => {
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
  })
}
