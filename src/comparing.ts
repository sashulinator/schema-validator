import { ComparingAssertion } from './types'

export function compareWith(keyInObjectStructure: string, comparingAssertion: ComparingAssertion, name?: string) {
  function getValueFromObjectStructure(value: unknown, key?: string, objStructure?: Record<string, unknown>) {
    return objStructure[keyInObjectStructure]
  }
  return [comparingAssertion, getValueFromObjectStructure, name ?? keyInObjectStructure]
}
