import { ValidationError } from './errors/validation'
import { ArrayElement, DeepPartial, DeepRequired, Dictionary } from './utils/types'

export interface Scene<TErrorCollection, TSchema extends Schema, TSchemaItem extends Schema> {
  schema: TSchema
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
  assertEqual: Assertion
  assertWithRegExp: Assertion
  collectError: CollectError
}

export type Assertion = SyncAssertion | AsyncAssertion

export type SyncAssertion = (...args: unknown[]) => void

export type AsyncAssertion = (...args: unknown[]) => Promise<void>

export type CollectError = (error: ValidationError, scene: Scene<unknown, Schema, Schema>) => void

export type Schema = string | number | RegExp | Dictionary<Schema> | Schema[] | SyncAssertion

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
