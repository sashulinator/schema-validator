import { withRef, only } from '../../src/refactoring'
import { basicBlockSchema, validCredentials, invalidBlock } from './schemas'

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
