import { isPromise } from '../..'
import { isObject } from '../../is'
import { ANY_KEY } from '../../types'
import { Scene } from '../types'
import { processFunction } from './function'
import { iteration } from './iteration'

export function processObject<TErrorCollection>(
  scene: Scene<TErrorCollection>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  if (!isObject(scene.input)) {
    scene.schemaItem = scene.assertObject
    return processFunction(scene)
  }

  scene.inputObject = scene.input as any

  const { input: sceneInput, schemaItem: sceneSchemaItem, path: scenePath } = scene

  const results: (Promise<TErrorCollection | undefined> | TErrorCollection | undefined)[] = []
  const schemaEntries = Object.entries(sceneSchemaItem)
  const inputEntries = Object.entries(sceneInput)

  const isAnyKey = schemaEntries.length === 1 && schemaEntries[0][0] === ANY_KEY

  if (isAnyKey) {
    for (let index = 0; index < inputEntries.length; index += 1) {
      const [inputName, input] = inputEntries[index]
      const [, schemaItem] = schemaEntries[0]
      results.push(iteration(inputName, scenePath, input, schemaItem, scene))
    }
  } else {
    for (let index = 0; index < schemaEntries.length; index += 1) {
      const [inputName, schemaItem] = schemaEntries[index]
      const input = sceneInput[inputName]

      if (ANY_KEY === inputName) {
        throw new Error('Schema with "ANY_KEY" must contain only one value with this key')
      }

      results.push(iteration(inputName, scenePath, input, schemaItem, scene))
    }
  }

  if (results.find(isPromise)) {
    return Promise.all(results).then(() => scene.errorCollection)
  }

  return scene.errorCollection
}
