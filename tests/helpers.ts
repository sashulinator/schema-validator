import { isObject, Meta, ValidationError } from '../src'

export const handleErrorsIntoObject = (
  errors: Record<string, unknown> = {},
  validationErrorOrErrors: Record<string, unknown> | ValidationError,
  meta?: Meta,
): Record<string, unknown> => {
  if (meta.path === '') {
    return Object.assign(errors, validationErrorOrErrors)
  }

  if (validationErrorOrErrors instanceof ValidationError) {
    createErrorTree(errors, meta.path, validationErrorOrErrors)
  } else if (isObject(validationErrorOrErrors)) {
    errors = Object.assign(errors, validationErrorOrErrors)
  }

  return errors
}

export const handleErrorsIntoArray = (
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

export const createErrorTree = (obj: Record<string, unknown>, pathString: string, value: any = null) => {
  let paths = pathString.split('.')
  let current = obj
  while (paths.length > 1) {
    const [head, ...tail] = paths
    paths = tail
    if (current[head] === undefined) {
      current[head] = {}
    }
    current = current[head] as Record<string, unknown>
  }
  if (value) {
    const oldValue = current[paths[0]] as any
    current[paths[0]] = { ...oldValue, ...value }
  }
  return obj
}
