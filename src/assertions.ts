import { isNumber } from './is-number'
import { isString } from './is-string'

export function assertNumber(input: unknown): asserts input is number {
  if (isNumber(input)) {
    return
  }

  throw Error('is not a number')
}

export function assertNotUndefined(input: unknown): asserts input is number {
  if (typeof input === 'undefined') {
    throw Error('cannot be undefined')
  }
}

export function assertNotNaN(input: unknown): asserts input is number {
  assertNumber(input)

  if (Number.isNaN(input)) {
    throw Error('is not a number')
  }
}

export function assertString(input: unknown): asserts input is string {
  if (isString(input)) {
    return
  }

  throw Error('is not a string')
}

export function assertNotMoreThan(input: unknown, num: number): void {
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

export function assertStringifiedNumber(input: unknown): void {
  assertString(input)

  try {
    assertNotNaN(parseInt(input, 10))
  } catch (e) {
    throw Error(`is not a stringified number`)
  }
}

export function assertRegExp(input: unknown): asserts input is RegExp {
  try {
    RegExp(input as string)
  } catch (e) {
    throw Error(`is not a regular expression`)
  }
}

export function assertMatchPattern(input: unknown, pattern: unknown): void {
  assertString(input)
  assertRegExp(pattern)

  const regExp = new RegExp(pattern)

  if (!regExp.test(input)) {
    throw new Error('does not match the pattern')
  }
}
