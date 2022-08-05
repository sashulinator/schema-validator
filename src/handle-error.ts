import { isObject, Meta, ValidationError } from '.'
import { buildObjectByPath } from './lib/build-object-from-path'

export const buildErrorArray = (
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

export const buildErrorTree = (
  errors: Record<string, unknown> = {},
  validationErrorOrErrors: Record<string, unknown> | ValidationError,
  meta?: Meta,
): Record<string, unknown> => {
  if (meta.path === '') {
    return Object.assign(errors, validationErrorOrErrors)
  }

  if (validationErrorOrErrors instanceof ValidationError) {
    buildObjectByPath(errors, meta.path, {
      _code: validationErrorOrErrors.code,
      _message: validationErrorOrErrors.message,
      _path: validationErrorOrErrors.path,
      _input: validationErrorOrErrors.input,
      _inputName: validationErrorOrErrors.inputName,
      _input2: validationErrorOrErrors.input2,
      _inputName2: validationErrorOrErrors.inputName2,
    })
  } else if (isObject(validationErrorOrErrors)) {
    errors = Object.assign(errors, validationErrorOrErrors)
  }

  return errors
}
