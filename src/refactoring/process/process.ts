import { isObject } from '../..'
import { Assertion, Scene, Schema } from '../types'
import { MaybePromise } from '../utils/types'
import { processArray } from './array'
import { processFunction } from './function'
import { processObject } from './object'

export function process<E>(scene: Scene<E, Schema>): MaybePromise<Scene<E, Schema>> {
  const { schemaItem } = scene

  if (typeof schemaItem === 'function') {
    return processFunction({ ...scene, schemaItem: schemaItem as Assertion })
  }

  if (schemaItem instanceof RegExp) {
    const value = schemaItem
    const newSchemaItem = function assertWithRegExp(x: unknown, newScene: Scene<unknown, Schema>) {
      scene.assertWithRegExp(x, value, newScene)
    }
    return processFunction({ ...scene, schemaItem: newSchemaItem })
  }

  if (typeof schemaItem === 'string' || typeof schemaItem === 'number') {
    const value = schemaItem
    const newSchemaItem = function assertEqual(x: unknown, newScene: Scene<unknown, Schema>) {
      scene.assertEqual(x, value, newScene)
    }
    return processFunction({ ...scene, schemaItem: newSchemaItem })
  }

  if (Array.isArray(schemaItem)) {
    return processArray({ ...scene, schemaItem })
  }

  if (isObject(schemaItem)) {
    return processObject({ ...scene, schemaItem })
  }

  throw Error('Schema Error: must be a function, string, number, regExp, array or object.')
}
