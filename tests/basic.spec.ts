import { assertString, and, assertNotEmptyString } from '../src'
import { ssv1, ssv2 } from './schemas'
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

  const validateTest4 = ssv2.wrap({
    user: ssv2.only({
      postcode: and(assertNotEmptyString, assertString),
      coordinates: ssv2.only({
        longitude: and(assertNotEmptyString, assertString),
        latitude: and(assertNotEmptyString, assertString),
      }),
    }),
    password: assertString,
  })

  const validateTest5 = ssv2.custom.validateSmth({
    test: and(assertNotEmptyString, assertString),
  })

  const validateTest6 = ssv2.only([
    {
      test: and(assertNotEmptyString, assertString),
    },
  ])

  it('simple valid', () => {
    const errors = validateTest({
      test: 'string',
    })

    expect(errors).toHaveLength(0)
  })

  it('simple invalid', () => {
    const errors1 = validateTest({
      test: 42,
    })

    expect(errors1.map(errorToObject)).toStrictEqual([
      {
        _code: 'assertString',
        _input: 42,
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

  it('object', () => {
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

  it('array', () => {
    const errors = validateTest6([{ test: 23 }])

    expect(errors).toStrictEqual({
      '0': {
        test: {
          _code: 'assertString',
          _input: 23,
          _inputName: 'test',
          _message: 'is not a string',
        },
      },
    })
  })

  it('only', () => {
    const errors = validateTest3({
      test: {
        testAgain: 'string',
        excessiveKey: '',
      },
      test1: 'string',
    })

    expect(errors.map(errorToObject)).toStrictEqual([
      {
        _code: 'excessiveKeys',
        _input: ['excessiveKey'],
        _inputName: 'test',
        _message: 'some keys are excessive',
      },
    ])
  })

  it('customValidator', () => {
    const errors = validateTest5({
      test: {
        test: '',
      },
    })

    expect(errors).toStrictEqual({
      _code: 'testCode',
      _input: 'testInput',
      _inputName: 'testSmth',
      _message: 'testMessage',
      test: {
        _code: 'assertString',
        _input: '[object Object]',
        _inputName: 'test',
        _message: 'is not a string',
      },
    })
  })

  it('handleErrorsIntoObject', () => {
    const errors = validateTest4({
      user: {
        postcode: 42,
        coordinates: {
          longitude: 42,
          latitude: 42,
        },
      },
      password: 34,
    })

    expect(errors).toStrictEqual({
      password: {
        _code: 'assertString',
        _input: 34,
        _inputName: 'password',
        _message: 'is not a string',
      },
      user: {
        coordinates: {
          latitude: {
            _code: 'assertString',
            _input: 42,
            _inputName: 'latitude',
            _message: 'is not a string',
          },
          longitude: {
            _code: 'assertString',
            _input: 42,
            _inputName: 'longitude',
            _message: 'is not a string',
          },
        },
      },
    })
  })

  it('access to nested object', () => {
    const errors = validateTest4.user.coordinates({
      longitude: /longtitude/,
      latitude: /latitude/,
    })

    expect(errors).toStrictEqual({
      longitude: {
        _code: 'assertString',
        _message: 'is not a string',
        _inputName: 'longitude',
        _input: '/longtitude/',
      },
      latitude: {
        _code: 'assertString',
        _message: 'is not a string',
        _inputName: 'latitude',
        _input: '/latitude/',
      },
    })
  })
})
