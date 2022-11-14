import { Scene, Schema } from '../types'
import { MaybePromise } from '../utils/types'
import { createScene } from '../lib/create-scene'
import { processFunction } from './function'
import { isPromise } from '../..'

export function processArray<E>(scene: Scene<E, Schema[]>): MaybePromise<Scene<E, Schema>> {
  if (!Array.isArray(scene.input)) {
    return processFunction({ ...scene, schemaItem: scene.assertArray })
  }

  const { input, path, schemaItem } = scene
  const results: MaybePromise<Scene<E, Schema>>[] = []

  if (schemaItem.length > 1) {
    throw Error('Schema Error: Array in a schema cannot have length more than 1. Maybe you want to use function "or"')
  }

  for (let index = 0; index < input.length; index += 1) {
    results.push(createScene({ index, path, input: input[index], schemaItem: schemaItem[0], ...scene }))
  }

  if (results.find(isPromise)) {
    return Promise.all(results).then(() => scene)
  }

  return scene
}
