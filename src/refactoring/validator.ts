import { ValidationError } from '../errors'
import { Scene, Schema, IsPromise } from './types'
import { process } from './process/process'
import { createScene } from './lib/create-scene'
import { isPromise } from '..'

export function validator<TSchema extends Schema, TErrorCollection = ValidationError[]>(
  schema: TSchema,
  input: unknown,
  presetScene?: Partial<Scene<TErrorCollection, Schema>>,
): IsPromise<TSchema, TErrorCollection> {
  const scene = createScene<TErrorCollection, Schema, Schema>({
    path: [],
    schema,
    schemaItem: schema,
    input,
    ...presetScene,
  })

  const result = process(scene)

  if (isPromise(result)) {
    return result.then((res) => res) as any
  }

  return result as any
}
