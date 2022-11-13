import { isNil, isPromise } from '../..'
import { ValidationError } from '../errors/validation'
import { Assertion, Scene, Schema } from '../types'
import { MaybePromise } from '../utils/types'

export function handleResult<E>(
  result: MaybePromise<Error | void | Scene<E, Schema>>,
  scene: Scene<E, Schema>,
): MaybePromise<Scene<E, Schema>> {
  if (isPromise(result)) {
    return result.then((r) => handleResult(r, scene))
  }

  if (isNil(result)) {
    return scene
  }

  if (result instanceof Error) {
    const vError = new ValidationError({
      message: result.message,
      code: (scene.schemaItem as Assertion).name,
      input: scene.input,
      inputName: scene.inputName,
      relative: scene.relative,
      relativeName: scene.relativeName,
      path: scene.path,
    })

    scene.collectError(vError, scene)

    delete scene.relative
    delete scene.relativeName
    return scene
  }

  return result
}
