import { ValidationError } from '../errors'
import { Scene, Schema, IsPromise } from './types'
import { process } from './process/process'
import { createScene } from './lib/create-scene'

export function validator<TSchema extends Schema, TErrorCollection = ValidationError[]>(
  schema: TSchema,
  input: unknown,
  presetScene?: Partial<Scene<TErrorCollection, Schema, Schema>>,
): IsPromise<TSchema, TErrorCollection> {
  const scene = createScene<TErrorCollection, Schema, Schema>({
    path: [],
    schema,
    schemaItem: schema,
    input,
    ...presetScene,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return process(scene) as any
}
