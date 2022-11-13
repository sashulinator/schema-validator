import { isNotPromise, isNotUndefined } from '..'
import { isPromise } from '../is'
import { createScene } from './lib/create-scene'
import { handleResult } from './lib/handle-result'
import { process } from './process/process'
import { IsPromise, Scene, Schema } from './types'
import { MaybePromise } from './utils/types'

export type OmitAnd<E, SC extends Schema> = (
  input: unknown,
  clientScene?: Partial<Scene<E, SC, SC>>,
) => IsPromise<SC[], E>

export function and<TErrorCollection, TSchemas extends Schema[]>(
  ...schemas: TSchemas
): OmitAnd<TErrorCollection, TSchemas> {
  return function emitAnd<E = TErrorCollection[]>(input: unknown, clientScene?: Partial<Scene<E, TSchemas, TSchemas>>) {
    const results: MaybePromise<Scene<unknown, Schema, Schema>>[] = []
    const scene = createScene({ path: [], ...clientScene, input, schema: schemas, schemaItem: schemas })

    for (let index = 0; index < schemas.length; index += 1) {
      const schema = schemas[index]
      const newScene = createScene({
        path: [],
        ...clientScene,
        input,
        schema,
        schemaItem: schema,
        errorCollection: { current: undefined },
      })

      results.push(process(newScene))

      return scene as any
    }
  }
}

function finalize(
  scene: Scene<unknown, Schema, Schema>,
  schemas: Schema[],
  errorCollections: MaybePromise<Scene<unknown, Schema, Schema>>[],
) {
  const isSomeWithError = errorCollections.some(isNotUndefined)
  const results: MaybePromise<Scene<unknown, Schema, Schema>>[] = []

  if (isSomeWithError) {
    for (let index = 0; index < schemas.length; index += 1) {
      const schema = schemas[index]
      results.push(process(createScene({ ...scene, schemaItem: schema })))
    }
  }

  return handleResult(results, scene)
}
