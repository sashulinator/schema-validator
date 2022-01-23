import { createStructureValidator, only } from '../../src/refactoring'
import { credentialsSchema, invalidCredentials, validCredentials } from './schemas'

describe(`${createStructureValidator.name}`, () => {
  it('basic callback test', () => {
    const testStructureValidator = createStructureValidator(
      ({ errorTree, inputName, unusedObjectKeys, unusedSchemaKeys, input }) => {
        expect(errorTree).toEqual({
          password: {
            _code: 'assertString',
            _input: 134234,
            _inputName: 'password',
            _message: 'is not a string',
          },
          username: {
            _code: 'assertString',
            _input: 1223,
            _inputName: 'username',
            _message: 'is not a string',
          },
        })
        expect(inputName).toEqual('testInputName')
        expect(unusedObjectKeys).toHaveLength(0)
        expect(unusedSchemaKeys).toHaveLength(0)
        expect(input).toEqual(invalidCredentials)
        return errorTree
      },
    )

    const validator = testStructureValidator(credentialsSchema)
    validator(invalidCredentials, { inputName: 'testInputName' })
  })

  it('unusedObjectKeys callback test', () => {
    const testStructureValidator = createStructureValidator(
      ({ errorTree, inputName, unusedObjectKeys, unusedSchemaKeys, input }) => {
        expect(errorTree).toBeUndefined()
        expect(inputName).toEqual('testInputName')
        expect(unusedObjectKeys).toEqual(['excessiveKey'])
        expect(unusedSchemaKeys).toHaveLength(0)
        expect(input).toEqual({ ...validCredentials, excessiveKey: 'excessiveValue' })
        return errorTree
      },
    )

    const validator = testStructureValidator(credentialsSchema)
    validator({ ...validCredentials, excessiveKey: 'excessiveValue' }, { inputName: 'testInputName' })
  })

  it('unusedSchemaKeys callback test', () => {
    const testStructureValidator = createStructureValidator(
      ({ errorTree, inputName, unusedObjectKeys, unusedSchemaKeys, input }) => {
        expect(errorTree).toEqual({
          username: { _code: 'assertString', _inputName: 'username', _message: 'is not a string' },
        })
        expect(inputName).toEqual('testInputName')
        expect(unusedObjectKeys).toHaveLength(0)
        expect(unusedSchemaKeys).toEqual(['username'])
        expect(input).toEqual({ password: 'password' })
        return errorTree
      },
    )

    const validator = testStructureValidator(credentialsSchema)
    validator({ password: 'password' }, { inputName: 'testInputName' })
  })

  it('returns also object schema', () => {
    const testStructureValidator = createStructureValidator(({ errorTree }) => {
      return errorTree
    })

    const validator = testStructureValidator(credentialsSchema)

    const error = validator.username(12)

    expect({ ...error }).toEqual({
      _code: 'assertString',
      _input: 12,
      _inputName: undefined,
      _message: 'is not a string',
    })
  })
})

// ONLY

describe(`${only.name}`, () => {
  it('basic', () => {
    const onlySchema = only(credentialsSchema)

    const errorTree = onlySchema({ testEscessiveKey: 'testEscessiveValue' })

    expect(errorTree).toEqual({
      _code: 'excessiveKeys',
      _input: ['testEscessiveKey'],
      _inputName: undefined,
      _message: 'some keys are excessive',
      password: {
        _code: 'assertString',
        _inputName: 'password',
        _message: 'is not a string',
      },
      username: {
        _code: 'assertString',
        _inputName: 'username',
        _message: 'is not a string',
      },
    })
  })
})
