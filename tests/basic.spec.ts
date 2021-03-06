import { string, buildErrorTree, wrap, only, notUndefined, and } from '../src'
import { nestedData, validateCreateUserData, anyKeyValidator } from './mock-schemas'

const wrap1 = wrap.bind({
  handleError: buildErrorTree,
}) as typeof wrap

describe('basic', () => {
  it('any_key valid', async () => {
    const errors = anyKeyValidator({
      one: { id: 'one', data: 1 },
      two: { id: 'two', data: 2 },
      three: { id: 'three', data: 3 },
    })

    expect(errors).toEqual(undefined)
  })

  it('any_key invalid', async () => {
    const errors = anyKeyValidator({
      one: { id: 'one', data: '1' },
      two: { id: 'two', data: '2' },
      three: { id: 'three', data: 3 },
    })

    expect(errors).toEqual({
      one: { data: { _code: 'assertNumber', _input: '1', _inputName: 'data', _message: 'is not a number' } },
      two: { data: { _code: 'assertNumber', _input: '2', _inputName: 'data', _message: 'is not a number' } },
    })
  })

  it('async', async () => {
    const asyncData = wrap1(
      only({
        test: and(async (v) => string(v), notUndefined),
      }),
    )

    const validationError = await asyncData({
      test: 1,
    })

    expect(validationError).toEqual({
      test: {
        _code: '',
        _input: 1,
        _inputName: 'test',
        _message: 'is not a string',
      },
    })
  })

  it('valid', () => {
    const errorCollection = validateCreateUserData({
      username: 'alex',
      password: 'p@ssword',
      email: 'hello@test.test',
      test: 'test',
    })

    expect(errorCollection).toBeUndefined()
  })

  it('invalid', () => {
    const errorCollection = validateCreateUserData({
      username: 1,
      password: 1,
      email: 'hello',
      test: 1,
    })

    expect(errorCollection).toEqual({
      email: {
        _code: 'assertMatchPattern',
        _input: 'hello',
        _input2: '/@.*\\.*./',
        _inputName2: 'email',
        _inputName: 'email',
        _message: 'does not match the pattern',
      },
      password: { _code: 'assertString', _input: 1, _inputName: 'password', _message: 'is not a string' },
      username: {
        _code: 'assertMatchPattern',
        _input: 1,
        _input2: '/^(\\w*)$/',
        _inputName: 'username',
        _message: 'is not a string',
      },
      test: {
        _code: 'assertString',
        _inputName: 'test',
        _message: 'is not a string',
        _input: 1,
      },
    })
  })

  it('chain access', () => {
    const validationError = validateCreateUserData.test(1)

    expect({ ...(validationError as any) }).toEqual({
      _message: 'is not a string',
      _inputName: 'test',
      _input: 1,
      _code: 'assertString',
    })
  })

  it('chain access to structure validator', () => {
    const validationError = nestedData.test({
      test3: 'test',
    })

    expect({ ...validationError }).toEqual({
      _code: 'excessiveKeys',
      _input: ['test3'],
      _inputName: 'test',
      _message: 'some keys are excessive',
    })
  })
})
