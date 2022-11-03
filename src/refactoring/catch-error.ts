import { ValidationError } from './errors/validation'
import { Scene } from './types'

export function catchError<TErrorCollection>(
  error: ValidationError,
  scene: Scene<TErrorCollection>,
): TErrorCollection | Promise<TErrorCollection> {
  scene.collectError(error, scene)
  return scene.errorCollection
}
