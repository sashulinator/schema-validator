/* eslint-disable jest/expect-expect */
import { assertMatchPattern, assertNumber, assertString } from '../src/assertions'
import { ValidationError } from '../src/errors'
import expectMatchError from './expect-match-error'
import { validate, validateIf } from '../src/validate'
import { only, compareWith } from '../src'

describe(`${validate.name}`, () => {
  it('returns error', () => {
    const emitValidation = validate(assertNumber)

    return expectMatchError(
      () => emitValidation('string', 'test'),
      new ValidationError({
        key: 'test',
        value: 'string',
        code: 'assertNumber',
        message: 'is not a number',
      }),
    )
  })

  it('get comparing value from object', () => {
    function testComparingAssertion(value: unknown, value2: string) {
      expect(value2).toBe('qwerty')
    }

    function getPasswordValue(_?: unknown, __?: string, objStructure?: Record<'password', string>) {
      return objStructure.password
    }

    const validateTest = only({
      password: validate(assertString),
      user: validate([testComparingAssertion, getPasswordValue, 'password']),
    })

    const validateTest2 = only({
      password: validate(assertString),
      user: validate(compareWith('password', assertMatchPattern)),
    })

    expect(
      validateTest({
        password: 'qwerty',
        user: 'vasya',
      }),
    ).toBeUndefined()

    expect(
      validateTest2({
        password: 'qwerty',
        user: 'qwerty',
      }),
    ).toBeUndefined()
  })

  it('returns error for ComparingAssertion', () => {
    const emitValidation = validate([assertMatchPattern, /test/, 'pattern'])

    return expectMatchError(
      () => emitValidation('string', 'test'),
      new ValidationError({
        key: 'test',
        value: 'string',
        key2: 'pattern',
        value2: '/test/',
        code: 'assertMatchPattern',
        message: 'does not match the pattern',
      }),
    )
  })
})

describe(`${validateIf.name}`, () => {
  it('pass if false', () => {
    expect(validateIf(false)([assertMatchPattern, /test/, 'pattern'])('test')).toBeUndefined()
  })

  it('pass if false function', () => {
    expect(validateIf(() => false)([assertMatchPattern, /test/, 'pattern'])('test')).toBeUndefined()
  })

  it('return error if true', () => {
    const emitValidation = validateIf(true)([assertMatchPattern, /test/, 'pattern'])

    return expectMatchError(
      () => emitValidation('string', 'test'),
      new ValidationError({
        key: 'test',
        value: 'string',
        key2: 'pattern',
        value2: '/test/',
        code: 'assertMatchPattern',
        message: 'does not match the pattern',
      }),
    )
  })

  it('return error if true function', () => {
    const emitValidation = validateIf(() => true)([assertMatchPattern, /test/, 'pattern'])

    return expectMatchError(
      () => emitValidation('string', 'test'),
      new ValidationError({
        key: 'test',
        value: 'string',
        key2: 'pattern',
        value2: '/test/',
        code: 'assertMatchPattern',
        message: 'does not match the pattern',
      }),
    )
  })
})
