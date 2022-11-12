import { isPromise } from '../../is'
import { Scene, Schema } from '../types'
import { processFunction } from './function'
import { iteration } from './iteration'

export function processArray<TErrorCollection>(
  scene: Scene<TErrorCollection, Schema, Schema[]>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  if (!Array.isArray(scene.input)) {
    return processFunction({ ...scene, schemaItem: scene.assertArray })
  }

  const { input, path, schemaItem } = scene
  const results: (Promise<TErrorCollection | undefined> | TErrorCollection | undefined)[] = []

  if (schemaItem.length > 1) {
    throw Error('Schema Error: Array in a schema cannot have length more than 1. Maybe you want to use function "or"')
  }

  for (let index = 0; index < input.length; index += 1) {
    results.push(iteration(index, path, input[index], schemaItem[0], scene))
  }

  if (results.find(isPromise)) {
    return Promise.all(results).then(() => scene.errorCollection.current)
  }

  return scene.errorCollection.current
}
