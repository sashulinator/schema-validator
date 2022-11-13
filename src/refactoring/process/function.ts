import { emitMaybeAssertion } from './emit-maybe-assertion'
import { Fn, Scene, Schema } from '../types'
import { MaybePromise } from '../utils/types'
import { handleResult } from '../lib/handle-result'

export function processFunction<E>(scene: Scene<E, Fn<Scene<E, Schema> | void>>): MaybePromise<Scene<E, Schema>> {
  const result = emitMaybeAssertion(scene)
  return handleResult(result, scene)
}
