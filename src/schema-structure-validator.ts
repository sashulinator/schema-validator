import { ValidationError } from './errors'
import { createStructureValidator } from './create-structure-validator'

export class SchemaStructureValidator<THandleErrors extends (errors: any, validationError?: ValidationError) => any> {
  private readonly handleErrors: THandleErrors

  constructor({ handleErrors }: { handleErrors: THandleErrors }) {
    this.handleErrors = handleErrors
  }

  public wrap = createStructureValidator((): ReturnType<THandleErrors> => undefined)

  public only = createStructureValidator((schema, input: any, additional) => {
    const schemaEntries = Object.entries(schema)
    const unusedSchemaKeys = []

    for (let index = 0; index < schemaEntries.length; index += 1) {
      const [objKey] = schemaEntries[index]
      const objValue = input?.[objKey]

      if (objValue === undefined) {
        unusedSchemaKeys.push(objKey)
      }
    }

    return new ValidationError({
      inputName: additional.inputName,
      input: unusedSchemaKeys,
      code: 'requiredKeys',
      message: 'some keys are required',
    })
  })
}
