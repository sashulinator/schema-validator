/* eslint-disable jest/expect-expect */
import { createStructureValidator } from '../../src/refactoring'
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
})