import { ValidationError } from './errors'

export const ANY_KEY = '[[[[[{{{{{{{ANY_KEY}}}}}}]]]]'

// Common

export type ErrorCollection = any

export type ErrorCollector<TErrorCollection> = (value: unknown, meta?: Meta) => TErrorCollection

export type Schema<Type> = Type extends Record<string, any>
  ? ObjectStructureSchema<Type>
  : Type extends unknown[]
  ? ArrayStructureSchema<Type[number]>
  : ErrorCollector<any>

export type ArrayStructureSchema<Type> = Schema<Type>[]

export type ObjectStructureSchema<Type> = {
  [Property in keyof Type]: Schema<Type[Property]>
}

export type Meta<TError = ErrorCollection> = {
  inputName?: string | undefined
  inputObject?: Record<string, unknown> | undefined
  initialInput?: unknown | undefined
  payload?: any
  path?: string
  handleError?: (errors: TError, validationError: ValidationError, meta: Meta<TError>) => TError
}

// TODO throw error, not return!
export type StructureAssertion = (schema: Schema<any>, input: unknown, meta: Meta) => ValidationError | void

export type Assertion = (input: unknown, meta?: Meta) => void

export type LogicalOperator = (...schemas: Schema<any>[]) => (input: unknown, meta?: Meta) => ErrorCollection
// DELETE
export type EmitAssertion = (assertion: Assertion, input: unknown, meta?: Meta) => ErrorCollection

// Process

export type ProcessFactory = <InputType>(schema: Schema<InputType>, input: any, meta?: Meta) => ErrorCollection

export type Process<TSchema> = (schema: TSchema, input: unknown, meta?: Meta) => ErrorCollection

// With

export type WithAssertion = (input: unknown, input2?: unknown, meta?: Meta) => void

export type WithRef = (refName: string, assertion: WithAssertion) => Assertion
export type WithValue = (input2: unknown, assertion: WithAssertion, name?: string) => Assertion
