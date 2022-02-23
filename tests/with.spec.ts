import { assertMatchPattern, assertRegExp, withRef, withValue } from '../src'
import { ssv2 } from './schemas'

describe('with', () => {
  const validateTest = ssv2.wrap({
    pattern: assertRegExp,
    test: withRef('pattern', assertMatchPattern),
  })

  const validateTest2 = ssv2.wrap({
    test: withValue(/^test/, assertMatchPattern),
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

  it('withValue basic', () => {
    const errors = validateTest2({
      test: 'nottest',
    })

    expect(errors).toStrictEqual({
      test: {
        _code: 'assertMatchPattern',
        _input: 'nottest',
        _input2: '/^test/',
        _inputName: 'test',
        _message: 'does not match the pattern',
      },
    })
  })
})
