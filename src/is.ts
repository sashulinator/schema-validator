export function isNotEmptyString<T>(value: T | ''): value is T {
  return value !== ''
}

export function isNotNil<T>(value: T | undefined | null): value is T {
  return value !== null && value !== undefined
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function isNotZero<T>(value: T | 0): value is T {
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

export function isBoolean(input: unknown): input is boolean {
  return input === true || input === false
}
