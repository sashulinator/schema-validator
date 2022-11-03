import { ValidationError } from './errors/validation'

export interface Scene<ErrorCollection = unknown> {
  path: string[]
  input: unknown
  schemaItem: Assertion | Record<string, unknown> | unknown[]
  errorCollection: ErrorCollection
  assertion: Assertion
  collectError: CollectError
}

export type Assertion = (input: unknown, scene: Scene) => void | Promise<void>

export type CollectError = (error: ValidationError, scene: Scene) => void
