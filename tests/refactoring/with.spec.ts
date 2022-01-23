import { withRef, only, withValue } from '../../src/refactoring'
import { basicBlockSchema, invalidBlock, emailSchema, invalidEmail } from './schemas'

describe(`${withRef.name}`, () => {
  it('basic', () => {
    const withRefSchema = only(basicBlockSchema)

    expect(withRefSchema(invalidBlock)).toEqual({
      defaultValue: {
        _code: 'assertMatchPattern',
        _message: 'does not match the pattern',
        _inputName: 'defaultValue',
        _input: 'notvalid',
        _inputName2: 'pattern',
        _input2: '/^test$/',
      },
    })
  })
})

// withValue

describe(`${withValue.name}`, () => {
  it('basic', () => {
    const withValueSchema = only(emailSchema)

    expect(withValueSchema(invalidEmail)).toEqual({
      email: {
        _code: 'assertMatchPattern',
        _message: 'does not match the pattern',
        _inputName: 'email',
        _input: 'notvalidemail',
        _inputName2: 'emailPattern',
        _input2: '/@.*\\.*./',
      },
    })
  })
})
