import { ValidationError } from './errors/validation'

export interface Scene<ErrorCollection = unknown> {
  path?: string[]
  input: unknown
  inputName?: string
  inputObject?: Record<string, unknown>
  schemaItem: Schema
  schema?: Schema
  errorCollection?: ErrorCollection
  assertObject: Assertion
  collectError: CollectError
}

export type Assertion = (input: unknown, scene: Scene) => void | Promise<void>

export type CollectError = (error: ValidationError, scene: Scene) => void

export type Schema = Assertion | Record<string, unknown> | unknown[]
