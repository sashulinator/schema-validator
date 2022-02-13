import { ValidationError } from '../src/errors'
import { SchemaStructureValidator } from '../src/schema-structure-validator'

const handleErrorsIntoArray = (
  errors: ValidationError[] = [],
  validationErrorOrErrors?: ValidationError | ValidationError[],
): ValidationError[] => {
  if (validationErrorOrErrors instanceof ValidationError) {
    errors.push(validationErrorOrErrors)
  } else if (Array.isArray(validationErrorOrErrors)) {
    return [...errors, ...validationErrorOrErrors]
  }

  return errors
}

export const ssv1 = new SchemaStructureValidator({
  handleErrors: handleErrorsIntoArray,
})

const val = ssv1.wrap({ gog: 'sd' })
