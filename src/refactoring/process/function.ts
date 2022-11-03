import { emitAssertion } from '../emit-assertion'
import { ValidationError } from '../errors/validation'
import { Scene } from '../types'

export function processFunction<TErrorCollection>(
  scene: Scene<TErrorCollection>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  const result = emitAssertion(scene)

  if (result === undefined) {
    return undefined
  }

  if (result instanceof ValidationError) {
    scene.collectError(result, scene)
    return scene.errorCollection
  }

  return result.then((error) => {
    scene.collectError(error, scene)
    return scene.errorCollection
  })
}
