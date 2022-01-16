import { ComparingAssertionArgs } from '.'
import { ComparingAssertion, ObjectStructure } from './types'

export type CompareWith = (
  keyInObjectStructure: string,
  comparingAssertion: ComparingAssertion,
  name?: string,
) => [ComparingAssertion, any | ((value: any, key?: string, structure?: ObjectStructure) => any), string?]

export const compareWith: CompareWith = (keyInObjectStructure, comparingAssertion, name) => {
  function getValueFromObjectStructure(value: any, key?: string, objStructure?: any): any {
    return objStructure[keyInObjectStructure]
  }
  return [comparingAssertion, getValueFromObjectStructure, name ?? keyInObjectStructure]
}

export type CompareIfWith = (
  cbOrBoolean: ((...args: ComparingAssertionArgs) => boolean) | boolean,
) => (
  keyInObjectStructure: string,
  comparingAssertion: ComparingAssertion,
  name?: string,
) => [ComparingAssertion, any | ((value: any, key?: string, structure?: ObjectStructure) => any), string?]

export const compareIfWith: CompareIfWith = (cbOrBoolean) => (keyInObjectStructure, comparingAssertion, name?) => {
  function getValueFromObjectStructure(value: any, key?: string, objStructure?: any): any {
    return objStructure[keyInObjectStructure]
  }

  const comparingAssertionWrapper: ComparingAssertion = (value, value2, key, key2, objectStructure) => {
    const cbResult = typeof cbOrBoolean === 'function' && cbOrBoolean(value2, value, key2, key, objectStructure)

    if (cbResult || cbOrBoolean === true) {
      comparingAssertion(value, value2, key, key2, objectStructure)
    }
  }

  Object.defineProperty(comparingAssertionWrapper, 'name', { value: comparingAssertion.name, writable: false })

  return [comparingAssertionWrapper, getValueFromObjectStructure, name ?? keyInObjectStructure]
}
