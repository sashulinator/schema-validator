import { isObject } from '../..'
import { Scene } from '../types'
import { processFunction } from './function'
import { processObject } from './object'

export function process<TErrorCollection>(
  scene: Scene<TErrorCollection>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  if (typeof scene.schemaItem === 'function') {
    return processFunction(scene)
  }

  // if (Array.isArray(schema)) {
  //   return processArray(schema, input, meta)
  // }

  if (isObject(scene.schemaItem)) {
    const res = processObject(scene)
    // console.log('sceneprocc', scene)
    return res
  }

  throw Error('Schema must be a function, array or object!')
}
