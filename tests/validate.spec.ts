/* eslint-disable jest/expect-expect */
import { assertMatchPattern, assertNumber } from '../src/assertions'
import { ValidationError } from '../src/errors'
import expectMatchError from '../src/expect-match-error'
import { validate } from '../src/validate'

describe(`${validate.name}`, () => {
  it('throws error', () => {
    const emitValidation = validate([assertNumber])

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

  it('returns error', () => {
    const emitValidation = validate([assertNumber])

    return expectMatchError(
      () => emitValidation('string', 'test', false),
      new ValidationError({
        key: 'test',
        value: 'string',
        code: 'assertNumber',
        message: 'is not a number',
      }),
    )
  })

  it('throws error for ComparingAssertion', () => {
    const emitValidation = validate([[assertMatchPattern, /test/, 'pattern']])

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

  it('returns error for ComparingAssertion', () => {
    const emitValidation = validate([[assertMatchPattern, /test/, 'pattern']])

    return expectMatchError(
      () => emitValidation('string', 'test', false),
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
