import { assertArray, assertObject, assertRegExp, assertString } from '../../assertions'
import { ValidationError } from '../../errors'
import { Scene } from '../types'

function defaultCollectError(error: ValidationError, scene: Scene<ValidationError[]>) {
  scene.errorCollection.current = scene.errorCollection.current ? [...scene.errorCollection.current, error] : [error]
}

function assertEqual(a: unknown, b: unknown, scene: Scene) {
  scene.relative = b
  scene.relativeName = 'comparing value'
  if (a !== b) {
    throw Error('not equal')
  }
}

function assertWithRegExp(a: unknown, b: unknown, scene: Scene) {
  assertRegExp(b)
  assertString(a)
  scene.relative = b
  scene.relativeName = 'regular expression'
  if (!b.test(a)) {
    throw Error('does not match')
  }
}

export function createScene<S extends Partial<Scene> | undefined>(scene: S): S & Scene {
  const clone = {
    errorCollection: { current: undefined },
    collectError: defaultCollectError,
    assertObject,
    assertArray,
    assertEqual,
    assertWithRegExp,
    ...scene,
  } as S

  return clone as S & Scene
}
