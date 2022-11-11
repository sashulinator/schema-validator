import { isPromise } from '../..'
import { ValidationError } from '../errors/validation'
import { Scene } from '../types'

export function emitAssertion(scene: Scene): Promise<ValidationError | undefined> | ValidationError | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assertion = scene.schemaItem as (...args: any[]) => undefined | Promise<undefined>

  try {
    const result = assertion(scene.input, scene)

    if (isPromise(result)) {
      return result.catch((e) => e)
    }

    return result
  } catch (e) {
    if (e instanceof Error) {
      return new ValidationError({
        message: e.message,
        code: assertion.name,
        input: scene.input,
        inputName: scene.inputName,
        path: scene.path,
      })
    }

    throw e
  }
}
