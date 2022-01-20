/* eslint-disable jest/expect-expect */
import { assertMatchPattern, assertNumber, assertString } from '../src/assertions'
import { ValidationError } from '../src/errors'
import expectMatchError from './expect-match-error'
import { primitive } from '../src/primitive'
import { only } from '../src'

describe(`${primitive.name}`, () => {
  it('returns error', () => {
    const emitValidation = primitive(assertNumber)

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
      password: primitive(assertString),
      user: primitive([testComparingAssertion, getPasswordValue, 'password']),
    })

    expect(
      validateTest({
        password: 'qwerty',
        user: 'vasya',
      }),
    ).toBeUndefined()
  })

  it('returns error for ComparingAssertion', () => {
    const emitValidation = primitive([assertMatchPattern, /test/, 'pattern'])

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
