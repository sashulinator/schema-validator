import { only } from '../../src/refactoring'
import { arrayBlockSchema, invalidArrayBlock } from './schemas'

describe('schemas with array', () => {
  it('basic', () => {
    const validator = only(arrayBlockSchema)

    const errorTree = validator(invalidArrayBlock)

    expect(errorTree).toEqual({
      defaultValue: {
        _code: 'assertMatchPattern',
        _message: 'does not match the pattern',
        _inputName: 'defaultValue',
        _input: 'notvalid',
        _inputName2: 'pattern',
        _input2: '/^test$/',
      },
      hints: {
        '1': {
          _code: 'assertMatchPattern',
          _message: 'does not match the pattern',
          _inputName: '1',
          _input: 'notvalid',
          _inputName2: 'pattern',
          _input2: '/^test$/',
        },
        '2': {
          _code: 'assertMatchPattern',
          _message: 'is not a string',
          _inputName: '2',
          _input: 1234,
          _inputName2: 'pattern',
          _input2: '/^test$/',
        },
      },
    })
  })
})
