import { isPromise } from '../..'
import { Assertion, Scene, Schema } from '../types'

export function emitAssertion(scene: Scene<unknown, Schema, Assertion>): Promise<Error | void> | Error | void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
