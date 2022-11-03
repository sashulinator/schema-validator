import { ValidationError } from './errors/validation'
import { Scene } from './types'

export function emitAssertion(scene: Scene): void {
  try {
    scene.assertion(scene.input, scene)
  } catch (e) {
    if (e instanceof Error) {
      throw new ValidationError({
        message: e.message,
        code: scene.assertion.name,
        input: scene.input,
      })
    }

    throw new Error('Error must be an instance of "Error".')
  }
}
