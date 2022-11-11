import { ValidationError } from './errors/validation'
import { Scene } from './types'

export function catchError<TErrorCollection>(
  error: ValidationError | undefined,
  scene: Scene<TErrorCollection>,
): TErrorCollection | Promise<TErrorCollection> {
  if (error === undefined) {
    return undefined
  }

  if (error instanceof Error) {
    const vError = new ValidationError({
      message: error.message,
      code: (scene.schemaItem as () => unknown).name,
      input: scene.input,
      inputName: scene.inputName,
      path: scene.path,
    })

    scene.collectError(vError, scene)
  }

  return scene.errorCollection.current
}
