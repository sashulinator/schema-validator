import { validateCreateUserData } from './mock-schemas'

describe('basic', () => {
  it('valid', () => {
    const errors = validateCreateUserData({
      username: 'alex',
      password: 'p@ssword',
      email: 'hello@test.test',
    })

    expect(errors).toBeUndefined()
  })

  it('invalid', () => {
    const errors = validateCreateUserData({
      username: 1,
      password: 1,
      email: 'hello',
    })

    expect(errors).toEqual({
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
    })
  })
})
