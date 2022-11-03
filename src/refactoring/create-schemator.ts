/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ValidationError } from './errors/validation'
import { Scene, Schema } from './types'
import { process } from './process/process'
import { isNil } from '..'

type PromiseSchema =
  | Promise<void>[]
  | Record<string, Promise<void>>
  | Promise<void>
  | PromiseSchema[]
  | { [k: string]: PromiseSchema }

type ValidatorReturn<TSchema, TErrorCollection> = TSchema extends PromiseSchema
  ? Promise<TErrorCollection | undefined>
  : TErrorCollection | undefined

export type Config<TErrorCollection> = {
  collectError?: Scene<TErrorCollection>['collectError']
  input?: unknown
  schema?: Schema
}

function collectError(error: ValidationError, scene: Scene<ValidationError[]>) {
  scene.errorCollection = scene.errorCollection ? [...scene.errorCollection, error] : [error]
}

export function createSchemator<TErrorCollection = unknown>(globalConfig?: Config<TErrorCollection>) {
  return function schemator<STErrorCollection = TErrorCollection>(
    schema?: Schema,
    schemaConfig?: Config<STErrorCollection>,
  ) {
    const config: Config<STErrorCollection> = { ...globalConfig, ...schemaConfig }
    return validator

    function validator(input?: unknown): ValidatorReturn<Schema, STErrorCollection> {
      const path: string[] = []
      const scene: Scene<TErrorCollection> = { schema, schemaItem: schema, input, path, collectError, ...config }

      if (scene.schema === undefined) {
        throw Error('Schema cannot be undefined.')
      }

      const result = process(scene)

      if (isNil(result)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return scene.errorCollection as any
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result.then(() => scene.errorCollection) as any
    }
  }
}
