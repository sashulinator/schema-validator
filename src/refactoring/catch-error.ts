import { ValidationError } from './errors/validation'
import { Scene } from './types'

export function catchError(error: unknown, scene: Scene): void | Promise<void> {
  if (error instanceof ValidationError) {
    scene.collectError(error, scene)
  } else {
    throw error
  }
}
