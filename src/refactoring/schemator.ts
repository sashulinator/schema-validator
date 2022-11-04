/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Scene } from './types'
import { validator } from './validator'

export function schemator<TSchema, TErrorCollection>(schema: TSchema, sScene?: TErrorCollection) {
  return <TSErrorCollection = TErrorCollection>(input: unknown, scene: Scene<TSErrorCollection>) =>
    validator<TSchema, TSErrorCollection>(schema, input, { ...sScene, ...scene })
}
