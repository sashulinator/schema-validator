import { ValidationError } from '../errors'
import { Scene, Schema } from './types'
import { process } from './process/process'
import { assertArray, assertObject } from '../assertions'

function defaultCollectError(error: ValidationError, scene: Scene<ValidationError[]>) {
  scene.errorCollection = scene.errorCollection ? [...scene.errorCollection, error] : [error]
}

export function validator<TSchema extends Schema, TErrorCollection = ValidationError[]>(
  schema: TSchema,
  input: unknown,
  presetScene?: Partial<Scene>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  const path: (string | number)[] = []
  const scene = {
    schema,
    schemaItem: schema,
    input,
    path,
    collectError: defaultCollectError,
    assertObject,
    assertArray,
    ...presetScene,
  } as Scene<TErrorCollection>

  if (scene.schema === undefined) {
    throw Error('Schema cannot be undefined.')
  }

  return process<TErrorCollection>(scene)
}
