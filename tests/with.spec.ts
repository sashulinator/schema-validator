import { assertMatchPattern, assertRegExp, assertString, withRef } from '../src'
import { ssv2 } from './schemas'

describe('with', () => {
  const validateTest = ssv2.wrap({
    pattern: assertRegExp,
    test: withRef('pattern', assertMatchPattern),
  })

  it('withRef basic', () => {
    const errors = validateTest({
      pattern: /^test/,
      test: 'nottest',
    })

    expect(errors).toStrictEqual({
      test: {
        _code: 'assertMatchPattern',
        _input: 'nottest',
        _input2: '/^test/',
        _inputName: 'test',
        _inputName2: 'pattern',
        _message: 'does not match the pattern',
      },
    })
  })
})
