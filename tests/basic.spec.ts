import { assertString, and, assertNotEmptyString } from '../src'
import { ssv1 } from './schemas'
import { errorToObject } from './utils'

describe('basic tests', () => {
  const validateTest = ssv1.wrap({
    test: assertString,
  })

  const validateTest2 = ssv1.wrap({
    test: and(assertNotEmptyString, assertString),
  })

  const validateTest3 = ssv1.wrap({
    test: ssv1.only({
      testAgain: and(assertNotEmptyString, assertString),
    }),
    test1: assertString,
  })

  it('simple valid', () => {
    const errors = validateTest({
      test: 'string',
    })

    expect(errors).toHaveLength(0)
  })

  it('simple invalid', () => {
    const errors1 = validateTest({
      test: 12,
    })

    expect(errors1.map(errorToObject)).toStrictEqual([
      {
        _code: 'assertString',
        _input: '12',
        _inputName: 'test',
        _message: 'is not a string',
      },
    ])
  })

  it('simple invalid with "and"', () => {
    const errors = validateTest2({})

    expect(errors.map(errorToObject)).toStrictEqual([
      {
        _code: 'assertString',
        _inputName: 'test',
        _message: 'is not a string',
      },
    ])

    const errors2 = validateTest2({
      test: '',
    })

    expect(errors2.map(errorToObject)).toStrictEqual([
      {
        _code: 'assertNotEmptyString',
        _inputName: 'test',
        _message: 'is an empty string',
      },
    ])
  })

  it('as property', () => {
    const errors = validateTest3({
      test: {
        testAgain: '',
      },
    })

    expect(errors.map(errorToObject)).toStrictEqual([
      {
        _code: 'assertNotEmptyString',
        _inputName: 'testAgain',
        _message: 'is an empty string',
      },
      {
        _code: 'assertString',
        _inputName: 'test1',
        _message: 'is not a string',
      },
    ])
  })
})
