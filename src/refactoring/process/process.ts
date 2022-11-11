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

  if ((scene.schemaItem as any) instanceof RegExp) {
    const value = scene.schemaItem
    scene.schemaItem = function assertWithRegExp(x: unknown, newScene: Scene) {
      scene.assertWithRegExp(x, value, newScene)
    }
    return processFunction(scene)
  }

  if (typeof scene.schemaItem === 'string' || typeof scene.schemaItem === 'number') {
    const value = scene.schemaItem
    scene.schemaItem = function assertEqual(x: unknown, newScene: Scene) {
      scene.assertEqual(x, value, newScene)
    }
    return processFunction(scene)
  }

  if (Array.isArray(scene.schemaItem)) {
    return processArray(scene)
  }

  if (isObject(scene.schemaItem)) {
    return processObject(scene)
  }

  throw Error('Schema Error: must be a function, array or object.')
}
