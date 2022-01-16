import { ComparingAssertion, ObjectStructure } from './types'

export function compareWith(
  keyInObjectStructure: string,
  comparingAssertion: ComparingAssertion,
  name?: string,
): [ComparingAssertion, any | ((value: any, key?: string, structure?: ObjectStructure) => any), string?] {
  function getValueFromObjectStructure(value: any, key?: string, objStructure?: any): any {
    return objStructure[keyInObjectStructure]
  }
  return [comparingAssertion, getValueFromObjectStructure, name ?? keyInObjectStructure]
}
