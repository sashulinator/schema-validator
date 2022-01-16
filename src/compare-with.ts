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
