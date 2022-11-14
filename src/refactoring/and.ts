import { isNotUndefined, isPromise } from '..'
import { createScene } from './lib/create-scene'
import { process } from './process/process'
import { IsPromise, Scene, Schema } from './types'
import { MaybePromise } from './utils/types'

type EmitAnd<E, TSchema extends Schema> = (
  input: unknown,
  clientScene?: Partial<Scene<E, Schema>>,
) => IsPromise<TSchema, Scene<E, Schema>>

export function and<E, TSchema extends Schema>(...schemas: TSchema[]): EmitAnd<E, TSchema> {
  return function emitAnd(input, clientScene) {
    const results: MaybePromise<Scene<E, Schema>>[] = []
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

    if (results.find(isPromise)) {
      return Promise.all(results).then((r) => finalize(scene, schemas, r)) as any
    }

    return finalize(scene, schemas, results as Scene<E, Schema>[]) as any
  }
}

function finalize<E>(
  scene: Scene<E, Schema>,
  schemas: Schema[],
  preResults: Scene<E, Schema>[],
): MaybePromise<Scene<E, Schema>> {
  const isSomeWithError = preResults.some((result) => isNotUndefined(result.errorCollection.current))
  const results: MaybePromise<Scene<unknown, Schema>>[] = []

  if (isSomeWithError) {
    for (let index = 0; index < schemas.length; index += 1) {
      const schema = schemas[index]
      results.push(process(createScene({ ...scene, schemaItem: schema })))
    }
  }

  if (results.find(isPromise)) {
    return Promise.all(results).then(() => scene)
  }

  return scene
}
