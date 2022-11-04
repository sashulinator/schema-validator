import { ValidationError } from '../errors'
import { Scene } from './types'
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

function defaultCollectError(error: ValidationError, scene: Scene<ValidationError[]>) {
  scene.errorCollection = scene.errorCollection ? [...scene.errorCollection, error] : [error]
}

export function validator<TSchema, TErrorCollection = ValidationError[]>(
  schema: TSchema,
  input: unknown,
  presetScene?: Scene,
): ValidatorReturn<TSchema, TErrorCollection> {
  const path: string[] = []
  const scene = {
    schema,
    schemaItem: schema,
    input,
    path,
    collectError: defaultCollectError,
    ...presetScene,
  } as Scene<TErrorCollection>

  if (scene.schema === undefined) {
    throw Error('Schema cannot be undefined.')
  }

  return process(scene) as ValidatorReturn<TSchema, TErrorCollection>
}
