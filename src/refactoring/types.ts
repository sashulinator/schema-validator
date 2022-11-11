import { ValidationError } from './errors/validation'
import { ArrayElement, DeepPartial, DeepRequired, Dictionary, DictionaryElement } from './utils/types'

export interface Scene<ErrorCollection = unknown> {
  path?: (string | number)[]
  input: unknown
  inputName?: string | number
  inputObject?: Record<string, unknown>
  schemaItem: Schema
  schema?: Schema
  errorCollection?: ErrorCollection
  assertObject: Assertion
  assertArray: Assertion
  collectError: CollectError
}

export type Assertion = (...args: unknown[]) => Promise<unknown> | unknown

export type PromiseAssertion = (...args: unknown[]) => Promise<unknown>

export type Validator<E> = (input: unknown, scene?: Scene<E>) => E

export type CollectError = (error: ValidationError, scene: Scene) => void

export type Schema = Dictionary<SchemaItem> | SchemaItem[] | Assertion

export type SchemaItem = string | number | RegExp | Dictionary<SchemaItem> | SchemaItem[] | Assertion

export type IsPromise<T, E> = T extends PromiseAssertion
  ? Promise<E>
  : T extends unknown[]
  ? IsPromise<ArrayElement<T>, E>
  : T extends Record<string, infer G>
  ? IsPromise<G, E>
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

type ToInput<T extends SchemaItem> = T extends Dictionary<SchemaItem>
  ? { [K in keyof T]: ToInput<T[K]> }
  : T extends SchemaItem[]
  ? ToInput<ArrayElement<T>>[]
  : T extends Assertion
  ? number | RegExp | string
  : T extends string
  ? string
  : T extends number
  ? number
  : unknown

export type SyncTypeAndSchema<
  A,
  B extends Schema,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  D extends DeepRequired<ToSchema<A>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  C extends DeepPartial<ToInput<B>>
> = true
