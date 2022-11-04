import { isPromise } from '../../is'
import { Scene, Schema } from '../types'
import { processFunction } from './function'
import { iteration } from './iteration'

export function processArray<TErrorCollection>(
  scene: Scene<TErrorCollection>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  if (!Array.isArray(scene.input)) {
    scene.schemaItem = scene.assertArray
    return processFunction(scene)
  }

  const { input: sceneInput, path: scenePath } = scene
  const sceneSchemaItem = scene.schemaItem as Schema[]
  const results: (Promise<TErrorCollection | undefined> | TErrorCollection | undefined)[] = []

  if (sceneSchemaItem.length > 1) {
    throw Error('Schema Error: Array in a schema cannot have length more than 1. Maybe you want to use function "or"')
  }

  for (let index = 0; index < sceneInput.length; index += 1) {
    const input = sceneInput[index]
    results.push(iteration(index, scenePath, input, sceneSchemaItem[0], scene))
  }

  if (results.find(isPromise)) {
    return Promise.all(results).then(() => scene.errorCollection)
  }

  return scene.errorCollection
}
