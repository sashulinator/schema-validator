import { assertArray, assertObject, assertRegExp, assertString } from '../../assertions'
import { ValidationError } from '../errors/validation'

import { Scene, Schema } from '../types'
import { PartialK } from '../utils/types'

function defaultCollectError(error: ValidationError, scene: Scene<ValidationError[], Schema, Schema>) {
  scene.errorCollection.current = scene.errorCollection.current ? [...scene.errorCollection.current, error] : [error]
}

function assertEqual(a: unknown, b: unknown, scene: Scene<unknown, Schema, Schema>) {
  scene.relative = b
  scene.relativeName = 'comparing value'
  if (a !== b) {
    throw Error('not equal')
  }
}

function assertWithRegExp(a: unknown, b: unknown, scene: Scene<unknown, Schema, Schema>) {
  assertRegExp(b)
  assertString(a)
  scene.relative = b
  scene.relativeName = 'regular expression'
  if (!b.test(a)) {
    throw Error('does not match')
  }
}

export function createScene<TErrorCollection, TSchema extends Schema, TSchemaItem extends Schema>(
  scene: PartialK<
    Scene<TErrorCollection, TSchema, TSchemaItem>,
    'assertObject' | 'assertArray' | 'assertEqual' | 'assertWithRegExp' | 'collectError'
  >,
): Scene<TErrorCollection, TSchema, TSchemaItem> {
  const clone: Scene<TErrorCollection, TSchema, TSchemaItem> = {
    errorCollection: { current: undefined },
    collectError: defaultCollectError,
    assertObject,
    assertArray,
    assertEqual,
    assertWithRegExp,
    ...scene,
  }

  return clone
}
