export function isNil(input: unknown): input is undefined | null {
  return input === null && input === undefined
}

export function isNotNil<T>(input: T | undefined | null): input is T {
  return input !== null && input !== undefined
}

export function isNull(input: unknown): input is null {
  return input === null
}

export function isNotNull<T>(input: T | null): input is T {
  return input !== null
}

export function isUndefined(input: unknown): input is unknown {
  return input === undefined
}

export function isNotUndefined<T>(input: T | undefined): input is T {
  return input !== undefined
}

export function isNumber(input: unknown): input is number {
  if (typeof input === 'number' || input instanceof Number) {
    return true
  }
  return false
}

export function isNotNumber<T>(input: T | number): input is T {
  return !isNumber(input)
}

export function isZero<T>(input: T | 0): input is T {
  return input === 0
}

export function isNotZero<T>(input: T | 0): input is T {
  return input !== 0
}

export function isString(input: unknown): input is string {
  if (typeof input === 'string' || input instanceof String) {
    return true
  }
  return false
}

export function isNotString<T>(input: string | T): input is T {
  return !isString(input)
}

export function isEmptyString<T>(input: T | ''): input is '' {
  return input === ''
}

export function isNotEmptyString<T>(input: T | ''): input is T {
  return input !== ''
}

export function isBoolean(input: unknown): input is boolean {
  return input === true || input === false
}

export function isNotBoolean<T>(input: boolean | T): input is T {
  return !isBoolean(input)
}
