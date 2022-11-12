import { isNotPromise, isNotUndefined, ValidationError } from '..'
import { isPromise } from '../is'
import { createScene } from './lib/create-scene'
import { process } from './process/process'
import { IsPromise, Scene, Schema } from './types'

export function or<Schemas extends Schema[]>(...schemas: Schema[]): IsPromise<Schemas, any> {
  return function emitOr<E = ValidationError[]>(input: unknown, clientScene?: Partial<Scene>): IsPromise<Schemas, E> {
    const results: (Promise<unknown | undefined> | unknown | undefined)[] = []
    const errorCollections: unknown[] = []
    const scene = createScene({ ...clientScene, input })

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
        return finalize(scene, schemas, errorCollections)
      }) as any
    }

    return finalize(scene, schemas, errorCollections) as any
  }
}

function finalize(
  scene: Scene,
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
