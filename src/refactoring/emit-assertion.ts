import { isNil } from '..'
import { ValidationError } from './errors/validation'
import { Assertion, Scene } from './types'

export function emitAssertion(scene: Scene): Promise<ValidationError | undefined> | ValidationError | undefined {
  const assertion = scene.schemaItem as Assertion

  try {
    const result = assertion(scene.input, scene)

    if (!isNil(result)) {
      return result.catch((e) => e)
    }
  } catch (e) {
    if (e instanceof Error) {
      return new ValidationError({
        message: e.message,
        code: assertion.name,
        input: scene.input,
      })
    }

    throw e
  }
}
