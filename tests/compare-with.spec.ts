import expectMatchError from './expect-match-error'
import {
  assertBoolean,
  assertMatchPattern,
  assertRegExp,
  assertStringifiedNumber,
  assertStringMaxLength,
  compareIfWith,
  isNotEmptyString,
  only,
  validate,
  validateIf,
} from '../src'

describe(`${compareIfWith.name}`, () => {
  const textSchema = only({
    maxlength: validateIf(isNotEmptyString)(assertStringifiedNumber),
    pattern: validateIf(isNotEmptyString)(assertRegExp),
    defaultValue: validateIf(isNotEmptyString)(
      compareIfWith(isNotEmptyString)('pattern', assertMatchPattern),
      compareIfWith(isNotEmptyString)('maxlength', assertStringMaxLength),
    ),
    hints: [
      validate(
        compareIfWith(isNotEmptyString)('pattern', assertMatchPattern),
        compareIfWith(isNotEmptyString)('maxlength', assertStringMaxLength),
      ),
    ],
  })

  it('no error', () => {
    const errorTree = textSchema({
      defaultValue: 'testDefaultValue',
      maxlength: '',
      pattern: '',
      hints: ['true', '77'],
    })

    expect(errorTree).toBeUndefined()
  })

  it('return errorTree', () => {
    const errorTree = textSchema({
      defaultValue: 'testDefaultValue',
      maxlength: '2',
      pattern: 'notest',
      hints: ['notest', 'test'],
    })

    return expectMatchError(() => errorTree, {
      defaultValue: {
        _code: 'assertMatchPattern',
        _key: 'defaultValue',
        _key2: 'pattern',
        _message: 'does not match the pattern',
        _value: 'testDefaultValue',
        _value2: 'notest',
      },
      hints: {
        '0': {
          _code: 'assertStringMaxLength',
          _key: '0',
          _key2: 'maxlength',
          _message: 'more than 2',
          _value: 'notest',
          _value2: '2',
        },
        '1': {
          _code: 'assertMatchPattern',
          _key: '1',
          _key2: 'pattern',
          _message: 'does not match the pattern',
          _value: 'test',
          _value2: 'notest',
        },
      },
    })
  })
})
