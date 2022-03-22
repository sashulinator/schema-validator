import { ValidationError } from './errors'

// Common

export type CollectedErrors = any

export type Schema<Type> = Type extends Record<string, any>
  ? ObjectStructureSchema<Type>
  : Type extends unknown[]
  ? ArrayStructureSchema<Type[number]>
  : EmitAssertion | Assertion | WithAssertion

export type ArrayStructureSchema<Type> = Schema<Type>[]

export type ObjectStructureSchema<Type> = {
  [Property in keyof Type]: Schema<Type[Property]>
}

export type Meta = {
  inputName?: string | undefined
  inputObject?: Record<string, unknown> | undefined
  initialInput?: unknown | undefined
  payload?: unknown
  path: string
  handleErrors: (errors: any, validationError: ValidationError, meta: Meta) => any
}

// Primitive

export type SchemaCollector = (...assertions: Assertion[]) => (input: unknown, meta?: Meta) => ErrorTree

export type Assertion = (input: unknown, meta?: Meta) => void

export type ErrorTree = any

export type EmitAssertion = (assertion: Assertion, input: unknown, meta?: Meta) => ErrorTree

// Process

export type CreateCustomError<TErrors = any> = (schema: Schema<any>, input: unknown, meta: Meta) => TErrors

export type ProcessFactory = <InputType>(
  schema: Schema<InputType>,
  input: any,
  meta?: Meta,
  cb?: CreateCustomError<any>,
) => CollectedErrors

export type Process<TSchema> = (
  schema: TSchema,
  input: unknown,
  meta?: Meta,
  cb?: CreateCustomError<any>,
) => CollectedErrors

// StructureValidator

export type EmitStructureValidation<TErrors> = (value: unknown, meta?: Meta) => TErrors

// With

export type WithAssertion = (input: unknown, input2?: unknown, meta?: Meta) => void

export type WithRef = (refName: string, assertion: WithAssertion) => (input: unknown, meta?: Meta) => void
export type WithValue = (
  input2: unknown,
  assertion: WithAssertion,
  name?: string,
) => (input: unknown, meta?: Meta) => void
