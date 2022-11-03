import { ValidationError } from './errors/validation'
import { Assertion, Scene } from './types'

export function emitAssertion(scene: Scene): void | Promise<void> {
  const assertion = scene.schemaItem as Assertion

  try {
    return assertion(scene.input, scene)
  } catch (e) {
    if (e instanceof Error) {
      throw new ValidationError({
        message: e.message,
        code: assertion.name,
        input: scene.input,
      })
    }

    throw e
  }
}
