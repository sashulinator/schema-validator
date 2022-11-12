import { ValidationError } from './errors/validation'
import { Assertion, Scene, Schema } from './types'

export function catchError<TErrorCollection>(
  error: Error | void,
  scene: Scene<TErrorCollection, Schema, Assertion>,
): TErrorCollection | Promise<TErrorCollection> {
  if (error === undefined) {
    return undefined
  }

  if (error instanceof Error) {
    const vError = new ValidationError({
      message: error.message,
      code: scene.schemaItem.name,
      input: scene.input,
      inputName: scene.inputName,
      relative: scene.relative,
      relativeName: scene.relativeName,
      path: scene.path,
    })

    scene.collectError(vError, scene)
  }

  return scene.errorCollection.current
}
