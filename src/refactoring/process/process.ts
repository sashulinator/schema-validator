import { Scene } from '../types'
import { processFunction } from './function'

export function process(scene: Scene): void | Promise<void> {
  if (typeof scene.schemaItem === 'function') {
    return processFunction(scene)
  }

  // if (Array.isArray(schema)) {
  //   return processArray(schema, input, meta)
  // }

  // if (isObject(schema)) {
  //   return processObject(schema, input, meta)
  // }

  throw Error('Schema must be a function, array or object!')
}
