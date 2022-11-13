import { ValidationError } from './errors/validation'
import { ArrayElement, DeepPartial, DeepRequired, Dictionary, MaybePromise } from './utils/types'

export interface Scene<TErrorCollection, TSchemaItem extends Schema> {
  schema: Schema
  schemaItem: TSchemaItem
  path: (string | number)[]
  input: unknown
  inputName?: string | number
  inputObject?: Record<string, unknown>
  relative?: unknown
  relativeName?: string | number
  errorCollection?: { current: TErrorCollection | undefined }
  assertObject: Assertion
  assertArray: Assertion
  assertEqual: (input: unknown, compareValue: string | number, scene?: Scene<unknown, Schema>) => MaybePromise<void>
  assertWithRegExp: (input: unknown, regExp: RegExp, scene?: Scene<unknown, Schema>) => MaybePromise<void>
  collectError: CollectError
}

export type Assertion = (input: unknown, scene?: Scene<unknown, Schema>) => MaybePromise<void>

export type Fn<R = unknown> = (input: unknown, scene?: Scene<unknown, Schema>) => MaybePromise<R>

export type CollectError = (error: ValidationError, scene: Scene<unknown, Schema>) => void

export type Schema = string | number | RegExp | Dictionary<Schema> | Schema[] | Assertion | Fn

export type IsPromise<T, E> = T extends (...args: unknown[]) => Promise<unknown>
  ? Promise<E>
  : T extends { [key: string]: infer G }
  ? IsPromise<G, E>
  : T extends (...args: unknown[]) => Promise<unknown>[]
  ? Promise<E>
  : E

export type ToSchema<T> = T extends Dictionary<unknown>
  ? { [K in keyof T]: ToSchema<T[K]> }
  : T extends unknown[]
  ? ToSchema<ArrayElement<T>>[]
  : T extends string
  ? Assertion | RegExp | string
  : T extends number
  ? Assertion | number
  : T extends RegExp
  ? Assertion
  : T

type ToInput<T extends Schema> = T extends Dictionary<Schema>
  ? { [K in keyof T]: ToInput<T[K]> }
  : T extends Schema[]
  ? ToInput<ArrayElement<T>>[]
  : T extends Assertion
  ? number | RegExp | string
  : T extends string
  ? string
  : T extends number
  ? number
  : unknown

// SyncTypeAndSchema<Schema, typeof schema, typeof schema, Schema>
export type SyncTypeAndSchema<
  A,
  B extends Schema,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  D extends DeepRequired<ToSchema<A>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  C extends DeepPartial<ToInput<B>>
> = true
