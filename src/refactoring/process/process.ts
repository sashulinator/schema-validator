import { isObject } from '../..'
import { Scene } from '../types'
import { processArray } from './array'
import { processFunction } from './function'
import { processObject } from './object'

export function process<TErrorCollection>(
  scene: Scene<TErrorCollection>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  if (typeof scene.schemaItem === 'function') {
    return processFunction(scene)
  }

  if (Array.isArray(scene.schemaItem)) {
    return processArray(scene)
  }

  if (isObject(scene.schemaItem)) {
    return processObject(scene)
  }

  if (typeof scene.schemaItem === 'string' || typeof scene.schemaItem === 'number') {
    const value = scene.schemaItem
    scene.schemaItem = function assertEqual(x: unknown) {
      scene.assertEqual(x, value)
    }
    return processFunction(scene)
  }

  throw Error('Schema Error: must be a function, array or object.')
}
