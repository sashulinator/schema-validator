/* eslint-disable jest/expect-expect */
import {
  assertMatchPattern,
  assertRegExp,
  assertStringifiedNumber,
  assertStringMaxLimit,
  compareWith,
  isNotEmptyString,
  isNotUndefined,
  notEmpty,
  omitIfComparisonHasNoValue,
  validate,
  validateIf,
} from '../src'

describe(`${omitIfComparisonHasNoValue.name}`, () => {
  it('no error', () => {
    const schema = notEmpty({
      defaultValue: validateIf(isNotEmptyString)(
        compareWith('pattern', omitIfComparisonHasNoValue(assertMatchPattern)),
        compareWith('maxlength', omitIfComparisonHasNoValue(assertStringMaxLimit)),
      ),
      maxlength: validateIf((v) => isNotUndefined(v) && isNotEmptyString(v))(assertStringifiedNumber),
      pattern: validateIf((v) => isNotEmptyString(v) && isNotUndefined(v))(assertRegExp),
      hints: notEmpty([
        validate(
          compareWith('pattern', omitIfComparisonHasNoValue(assertMatchPattern)),
          compareWith('maxlength', omitIfComparisonHasNoValue(assertStringMaxLimit)),
        ),
      ]),
    })

    const structure = {
      defaultValue: 'testDefaultValue',
      maxlength: '',
      // pattern: undefined,
      hints: ['testHintValue1'],
    }

    expect(schema(structure)).toBeUndefined()
  })
})
