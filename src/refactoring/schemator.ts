/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Assertion, Scene, Schema } from './types'
import { validator } from './validator'

export function schemator<TSchema, TErrorCollection>(schema: TSchema, sScene?: TErrorCollection) {
  return <TSErrorCollection = TErrorCollection>(input: unknown, scene: Scene<TSErrorCollection>) =>
    validator<TSchema, TSErrorCollection>(schema, input, { ...sScene, ...scene })
}

type Validator<E> = <TErrorCollection = E>(input: unknown, scene?: Scene<TErrorCollection>) => TErrorCollection

type WrapObject<O extends Record<string, unknown>, E> = {
  [K in keyof O]: O[K] extends Record<string, unknown> ? Wrap<O[K], E> & Validator<E> : Validator<E>
}

type WrapArray<TSchema extends Schema[], E> = TSchema extends [infer B, ...infer R]
  ? B extends Schema[]
    ? R extends Schema[]
      ? [Wrap<B, E>, ...WrapArray<R, E>]
      : [Wrap<B, E>]
    : never
  : never

type Wrap<TSchema extends Schema, E> = TSchema extends Record<string, Schema>
  ? WrapObject<TSchema, E> & Validator<E>
  : TSchema extends Schema[]
  ? WrapArray<TSchema, E> & Validator<E>
  : Validator<E>

// TypeSchema

type ObjectTypeSchema<O extends Record<string, unknown>> = {
  [K in keyof O]: O[K] extends Record<string, unknown> ? ObjectTypeSchema<O[K]> : TypeSchema<O[K]>
}

type ArrayTypeSchema<T extends unknown[]> = T extends [infer B, ...infer R]
  ? B extends unknown[]
    ? R extends unknown[]
      ? [TypeSchema<B>, ...ArrayTypeSchema<R>]
      : [TypeSchema<B>]
    : never
  : never

type TypeSchema<T> = T extends Record<string, unknown>
  ? ObjectTypeSchema<T>
  : T extends unknown[]
  ? ArrayTypeSchema<T>
  : Assertion
