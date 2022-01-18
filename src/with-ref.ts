import { ComparingAssertion, ObjectStructure } from './types'

export type WithRef = (
  keyInObjectStructure: string,
  comparingAssertion: ComparingAssertion,
  name?: string,
) => [ComparingAssertion, any | ((value: any, key?: string, structure?: ObjectStructure) => any), string?]

export const withRef: WithRef = (keyInObjectStructure, comparingAssertion, name) => {
  function getValueFromObjectStructure(value: any, key?: string, objStructure?: any): any {
    return objStructure[keyInObjectStructure]
  }
  return [comparingAssertion, getValueFromObjectStructure, name ?? keyInObjectStructure]
}

export type WithValue = (
  value2: any,
  comparingAssertion: ComparingAssertion,
  key2?: string,
) => [ComparingAssertion, any | ((value: any, key?: string, structure?: ObjectStructure) => any), string?]

export const withValue: WithValue = (value2, comparingAssertion, key2) => {
  return [comparingAssertion, value2, key2]
}
