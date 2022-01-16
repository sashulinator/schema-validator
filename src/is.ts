export function isNotEmptyString(value: unknown): boolean {
  return value !== ''
}

export function isNotNil(value: unknown): boolean {
  return value !== null && value !== undefined
}

export function isNotNull(value: unknown): boolean {
  return value !== null
}

export function isNotUndefined(value: unknown): boolean {
  return value !== undefined
}

export function isNotZero(value: unknown): boolean {
  return value !== 0
}

export function isNumber(input: unknown): input is number {
  if (typeof input === 'number' || input instanceof Number) {
    return true
  }
  return false
}

export function isString(input: unknown): input is string {
  if (typeof input === 'string' || input instanceof String) {
    return true
  }
  return false
}
