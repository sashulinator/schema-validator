import { ValidationError } from '../errors'
import { Scene, Schema, IsPromise } from './types'
import { process } from './process/process'
import { assertArray, assertObject } from '../assertions'

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

export function validator<TSchema extends Schema, TErrorCollection = ValidationError[]>(
  schema: TSchema,
  input: unknown,
  presetScene?: Partial<Scene>,
): IsPromise<TSchema, TErrorCollection> {
  const path: (string | number)[] = []
  const scene = {
    schema,
    schemaItem: schema,
    input,
    path,
    errorCollection: { current: undefined },
    collectError: defaultCollectError,
    assertObject,
    assertArray,
    assertEqual,
    ...presetScene,
  } as Scene<TErrorCollection>

  if (scene.schema === undefined) {
    throw Error('Schema cannot be undefined.')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return process(scene) as any
}
