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

// TypeSchema

type ObjectToSchemaItem<O extends Dictionary<unknown>> = {
  [K in keyof O]: O[K] extends Dictionary<unknown> ? ObjectToSchemaItem<O[K]> : ToSchema<O[K]>
}

export type ToSchema<T> = T extends Dictionary<unknown>
  ? ObjectToSchemaItem<T>
  : T extends unknown[]
  ? ToSchema<ArrayElement<T>>[]
  : T extends string
  ? Assertion | RegExp | string
  : T extends number
  ? Assertion | number
  : T extends RegExp
  ? Assertion
  : T

// TypeInput

type ObjectToInputItem<O extends Dictionary<SchemaItem>> = {
  [K in keyof O]: O[K] extends Dictionary<SchemaItem> ? ObjectToInputItem<O[K]> : ToInput<O[K]>
}

type ToInputItem<T extends SchemaItem> = T extends Dictionary<SchemaItem>
  ? ObjectToInputItem<T>
  : T extends SchemaItem[]
  ? ToInputItem<ArrayElement<T>>[]
  : T extends Assertion
  ? number | RegExp | string
  : T extends string
  ? string
  : T extends number
  ? number
  : unknown

export type ToInput<T extends SchemaItem> = ToInputItem<T>

export type SyncTypeAndSchema<
  A,
  B extends Schema,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  D extends DeepRequired<ToSchema<A>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  C extends DeepPartial<ToInput<B>>
> = true
