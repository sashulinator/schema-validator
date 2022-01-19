/* eslint-disable jest/expect-expect */
import { assertMatchPattern, assertNumber, assertString } from '../src/assertions'
import { ValidationError } from '../src/errors'
import expectMatchError from './expect-match-error'
import { validate } from '../src/validate'
import { only } from '../src'

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

    expect(
      validateTest({
        password: 'qwerty',
        user: 'vasya',
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
