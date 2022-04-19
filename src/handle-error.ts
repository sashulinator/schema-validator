import { buildObjectByPath, isObject, Meta, ValidationError } from '.'

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
    buildObjectByPath(errors, meta.path, validationErrorOrErrors)
  } else if (isObject(validationErrorOrErrors)) {
    errors = Object.assign(errors, validationErrorOrErrors)
  }

  return errors
}
