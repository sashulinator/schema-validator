import { catchError } from '../catch-error'
import { emitAssertion } from './emit-assertion'
import { Scene } from '../types'
import { isPromise } from '../..'

export function processFunction<TErrorCollection>(
  scene: Scene<TErrorCollection>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  const newScene = { ...scene }
  newScene.errorCollection = scene.errorCollection

  const result = emitAssertion(newScene)

  if (isPromise(result)) {
    return result.then((error) => {
      const err = catchError(error, newScene)
      return err
    })
  }

  return catchError(result, newScene)
}
