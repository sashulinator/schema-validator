/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ValidationError } from './errors/validation'
import { Scene, Schema } from './types'
import { process } from './process/process'

type PromiseSchema =
  | Promise<void>[]
  | Record<string, Promise<void>>
  | Promise<void>
  | PromiseSchema[]
  | { [k: string]: PromiseSchema }

type ValidatorReturn<TSchema, TErrorCollection> = TSchema extends PromiseSchema
  ? Promise<TErrorCollection | undefined>
  : TErrorCollection | undefined

function collectError(error: ValidationError, scene: Scene<ValidationError[]>) {
  scene.errorCollection = scene.errorCollection ? [...scene.errorCollection, error] : [error]
}

export function createSchemator<TErrorCollection = ValidationError[]>(createSchematorScene?: Scene<TErrorCollection>) {
  return function schemator<TSchema extends PromiseSchema | Schema, STErrorCollection = TErrorCollection>(
    schema?: TSchema,
    schematorScene?: Scene<STErrorCollection>,
  ) {
    return validator

    function validator(input?: unknown): ValidatorReturn<TSchema, STErrorCollection> {
      const path: string[] = []
      const scene = {
        schema,
        schemaItem: schema,
        input,
        path,
        collectError,
        ...createSchematorScene,
        ...schematorScene,
      } as Scene<STErrorCollection>

      if (scene.schema === undefined) {
        throw Error('Schema cannot be undefined.')
      }

      return process(scene) as ValidatorReturn<TSchema, STErrorCollection>
    }
  }
}
