import { isPromise } from '../..'
import { Fn, Scene, Schema } from '../types'
import { MaybePromise } from '../utils/types'

export function emitMaybeAssertion<E>(
  scene: Scene<E, Fn<Scene<E, Schema> | void>>,
): MaybePromise<Scene<E, Schema> | Error | void> {
  const assertion = scene.schemaItem

  try {
    const result = assertion(scene.input, scene)

    if (isPromise(result)) {
      return result.catch((e) => e)
    }

    return result
  } catch (e) {
    return e
  }
}
