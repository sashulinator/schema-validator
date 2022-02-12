import { ValidationError } from '../src/errors'
import { SchemaStructureValidator } from '../src/schema-structure-validator'

const handleErrorsIntoArray = (errors: ValidationError[] = [], validationError: ValidationError): ValidationError[] => {
  if (validationError) {
    errors.push(validationError)
  }
  return errors
}

export const ssv1 = new SchemaStructureValidator({
  handleErrors: handleErrorsIntoArray,
})
