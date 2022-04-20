import { validateCreateUserData } from './mock-schemas'

describe('basic', () => {
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

    expect({ ...validationError }).toEqual({
      _message: 'is not a string',
      _inputName: 'test',
      _input: 1,
      _code: 'assertString',
    })
  })
})
