import { isNil } from '../../is'
import { catchError } from '../catch-error'
import { emitAssertion } from '../emit-assertion'
import { Scene } from '../types'

export function processFunction(scene: Scene): void | Promise<void> {
  try {
    const result = emitAssertion(scene)

    if (!isNil(result)) {
      return result.catch((error) => catchError(error, scene))
    }
  } catch (error) {
    catchError(error, scene)
  }
}
