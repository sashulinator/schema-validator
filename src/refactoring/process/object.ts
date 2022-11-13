import { isPromise } from '../..'
import { isObject } from '../../is'
import { ANY_KEY } from '../../types'
import { createScene } from '../lib/create-scene'
import { Scene, Schema } from '../types'
import { Dictionary, MaybePromise } from '../utils/types'
import { processFunction } from './function'

export function processObject<E>(scene: Scene<E, Dictionary<Schema>>): MaybePromise<Scene<E, Schema>> {
  if (!isObject(scene.input)) {
    return processFunction({ ...scene, schemaItem: scene.assertObject })
  }

  scene.inputObject = scene.input

  const { input: sceneInput, schemaItem: sceneSchemaItem, path } = scene

  const results: MaybePromise<Scene<E, Schema>>[] = []
  const schemaEntries = Object.entries(sceneSchemaItem)
  const inputEntries = Object.entries(sceneInput)

  const isAnyKey = schemaEntries.length === 1 && schemaEntries[0][0] === ANY_KEY

  if (isAnyKey) {
    for (let index = 0; index < inputEntries.length; index += 1) {
      const [inputName, input] = inputEntries[index]
      const [, schemaItem] = schemaEntries[0]
      results.push(createScene({ inputName, path, input, schemaItem, ...scene }))
    }
  } else {
    for (let index = 0; index < schemaEntries.length; index += 1) {
      const [inputName, schemaItem] = schemaEntries[index]
      const input = sceneInput[inputName]

      if (ANY_KEY === inputName) {
        throw new Error('Schema with "ANY_KEY" must contain only one value with this key')
      }

      results.push(createScene({ inputName, path, input, schemaItem, ...scene }))
    }
  }

  if (results.find(isPromise)) {
    return Promise.all(results).then(() => scene)
  }

  return scene
}
