import { catchError } from '../catch-error'
import { emitAssertion } from './emit-assertion'
import { Assertion, Scene, Schema } from '../types'
import { isPromise } from '../..'

export function processFunction<TErrorCollection>(
  scene: Scene<TErrorCollection, Schema, Assertion>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  const newScene = { ...scene }
  newScene.errorCollection = scene.errorCollection

  const result = emitAssertion(newScene)

  if (isPromise(result)) {
    return result.then((error) => {
      const err = catchError<TErrorCollection>(error, newScene)
      return err
    })
  }

  return catchError(result, newScene)
}
