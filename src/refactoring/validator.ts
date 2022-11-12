import { ValidationError } from '../errors'
import { Scene, Schema, IsPromise } from './types'
import { process } from './process/process'
import { createScene } from './lib/create-scene'

export function validator<TSchema extends Schema, TErrorCollection = ValidationError[]>(
  schema: TSchema,
  input: unknown,
  presetScene?: Partial<Scene>,
): IsPromise<TSchema, TErrorCollection> {
  const scene = createScene({ path: [], schema, schemaItem: schema, input, ...presetScene }) as Scene
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return process(scene) as any
}
