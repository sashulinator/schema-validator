import { isEmptyString, isObject, isPromise, isStringifiedNumber, Meta } from '.'
import { isNumber, isString, isNil, isBoolean, isNull } from './is'

export { assertNil as nil }
export function assertNil(input: unknown): input is undefined | null | void {
  if (isNil(input)) {
    return
  }

  throw Error('is not nil')
}

export { assertNotNil as notNil }
export function assertNotNil<T>(input: T | undefined | null | void): asserts input is T {
  if (!isNil(input)) {
    return
  }

  throw Error('is nil')
}

export { assertNull as _null }
export function assertNull(input: unknown): asserts input is null {
  if (isNull(input)) {
    return
  }

  throw Error('is not null')
}

export { assertNotNull as notNull }
export function assertNotNull<T>(input: T | null): asserts input is T {
  if (!isNull(input)) {
    return
  }

  throw Error('is null')
}

export { assertNumber as number }
export function assertNumber(input: unknown): asserts input is number {
  if (isNumber(input)) {
    return
  }

  throw Error('is not a number')
}

export { assertString as string }
export function assertString(input: unknown): asserts input is string {
  if (!isString(input)) {
    throw Error('is not a string')
  }
}

export { assertEmptyString as emptyString }
export function assertEmptyString(input: unknown): asserts input is '' {
  if (isEmptyString(input)) {
    return
  }

  throw Error('is not a string')
}

export { assertNotEmptyString as notEmptyString }
export function assertNotEmptyString<T>(input: T | ''): asserts input is T {
  if (input === '') {
    throw Error('is an empty string')
  }
}

export { assertBoolean as boolean }
export function assertBoolean(input: unknown): asserts input is boolean {
  if (isBoolean(input)) {
    return
  }

  throw Error('is not a boolean')
}

export { assertNotUndefined as notUndefined }
export function assertNotUndefined<T>(input: T | undefined): asserts input is T {
  if (typeof input === 'undefined') {
    throw Error('cannot be undefined')
  }
}

export { assertUndefined as _undefined }
export function assertUndefined(input: unknown): asserts input is undefined {
  if (typeof input !== 'undefined') {
    throw Error('must be undefined')
  }
}

export { assertNotNaN as notNaN }
export function assertNotNaN(input: unknown): void {
  if (Number.isNaN(input)) {
    throw Error('is NaN')
  }
}

export { assertNotMoreThan as notMoreThan }
export function assertNotMoreThan(input: unknown, num: unknown): void {
  if (!isNumber(input) && !isString(input)) {
    throw Error(`must be a string or number`)
  }

  if (!isNumber(num) && !isString(num)) {
    throw Error(`must be a string or number`)
  }

  const inputNum = isNumber(input) ? input : parseInt(input, 10)
  const numNum = isNumber(num) ? num : parseInt(num, 10)

  assertNotNaN(inputNum)
  assertNotNaN(numNum)

  if (inputNum <= numNum) {
    return
  }

  throw Error(`more than ${num}`)
}

export { assertStringMaxLength as stringMaxLength }
export function assertStringMaxLength(input: unknown, num: unknown): void {
  assertString(input)

  assertNotMoreThan(input.length, num)
}

export { assertStringifiedNumber as stringifiedNumber }
export function assertStringifiedNumber(input: unknown): void {
  if (!isStringifiedNumber(input)) {
    throw Error(`is not a stringified number`)
  }
}

export { assertRegExp as regExp }
export function assertRegExp(input: unknown): asserts input is RegExp {
  if (!isString(input) && !(input instanceof RegExp)) {
    throw Error(`is not a regular expression`)
  }

  try {
    RegExp(input as string)
  } catch (e) {
    throw Error(`is not a regular expression`)
  }
}

export { assertMatchPattern as matchPattern }
export function assertMatchPattern(input: unknown, pattern: unknown): void {
  assertString(input)
  assertRegExp(pattern)

  const regExp = new RegExp(pattern)

  if (!regExp.test(input)) {
    throw new Error('does not match the pattern')
  }
}

export { assertIgnorePattern as ignorePattern }
export function assertIgnorePattern(input: unknown, pattern: unknown): void {
  assertString(input)
  assertRegExp(pattern)

  const regExp = new RegExp(pattern)

  if (regExp.test(input)) {
    throw new Error('match the pattern')
  }
}

export { assertArray as _array }
export function assertArray<T>(input: T[] | unknown): asserts input is T[] {
  if (!Array.isArray(input)) {
    throw new Error('is not an array')
  }
}

export { assertObject as object }
export function assertObject<T extends Record<string, unknown>>(input: T | unknown): asserts input is T {
  if (!isObject(input)) {
    throw new Error('is not an object')
  }
}

export type NotEmptyArray<T> = [T, ...T[]]

export { assertNotEmptyArray as notEmptyArray }
export function assertNotEmptyArray<T>(input: T[] | unknown): asserts input is NotEmptyArray<T> {
  if (Array.isArray(input) && input.length === 0) {
    throw new Error('an empty array')
  }
}

export { assertKeyDoesNotExist as keyDoesNotExist }
export function assertKeyDoesNotExist(input: unknown, meta?: Meta): void {
  if (meta?.inputName && meta?.inputObject && meta?.inputName in meta?.inputObject) {
    throw new Error('key exists')
  }
}

export function assertPromise(input: unknown): void {
  if (!isPromise(input)) {
    throw Error(`is not a promise`)
  }
}
