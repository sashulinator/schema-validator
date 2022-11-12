import { isNotPromise, isNotUndefined } from '..'
import { isPromise } from '../is'
import { createScene } from './lib/create-scene'
import { process } from './process/process'
import { IsPromise, Scene, Schema } from './types'

export type OmitOr<E, SC extends Schema> = (
  input: unknown,
  clientScene?: Partial<Scene<E, SC, SC>>,
) => IsPromise<SC[], E>

export function or<TErrorCollection, TSchemas extends Schema[]>(
  ...schemas: TSchemas
): OmitOr<TErrorCollection, TSchemas> {
  return function emitOr<E = TErrorCollection[]>(input: unknown, clientScene?: Partial<Scene<E, TSchemas, TSchemas>>) {
    const results: (Promise<unknown | undefined> | unknown | undefined)[] = []
    const errorCollections: unknown[] = []
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
    }

    results.filter(isNotPromise).forEach((item) => errorCollections.push(item))

    if (results.find(isPromise)) {
      return Promise.all(results).then((collections) => {
        collections.forEach((item) => errorCollections.push(item))
        return finalize(scene, schemas, errorCollections) as any
      })
    }

    return finalize(scene, schemas, errorCollections) as any
  }
}

function finalize(
  scene: Scene<unknown, Schema, Schema>,
  schemas: Schema[],
  errorCollections: (Promise<unknown | undefined> | unknown | undefined)[],
) {
  const isEveryWithError = errorCollections.every(isNotUndefined)

  if (isEveryWithError) {
    scene.schema = scene.schema ? scene.schema : schemas[0]
    // eslint-disable-next-line prefer-destructuring
    scene.schemaItem = schemas[0]
    process(scene)
  }

  return scene.errorCollection.current
}
