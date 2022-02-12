import { ValidationError } from './errors'

// Common

export type Schema<Type> = Type extends Record<string, any>
  ? ObjectStructureSchema<Type>
  : Type extends unknown[]
  ? ArrayStructureSchema<Type[number]>
  : EmitAssertion

export type ArrayStructureSchema<Type> = Schema<Type>[]

export type ObjectStructureSchema<Type> = {
  [Property in keyof Type]: Schema<Type[Property]>
}

export type Additional = {
  inputName?: string | undefined
  inputObject?: Record<string, unknown> | undefined
  initialInput?: unknown | undefined
  payload?: unknown
  handleErrors: (errors: any, validationError: ValidationError) => any
}

// Primitive

export type Primitive = (...assertions: Assertion[]) => EmitAssertion

export type Assertion = (input: unknown, additional?: Additional) => void

export type ErrorTree = any

export type EmitAssertion = (input: unknown, additional?: Additional) => ErrorTree

// Process

export type ProcessResult = {
  errorTree: ErrorTree
  unusedObjectKeys: string[]
  unusedSchemaKeys: string[]
}

export type ProcessFactory = <InputType>(
  schema: Schema<InputType>,
  input: unknown,
  additional?: Additional,
) => ProcessResult

export type Process<InputType> = (schema: Schema<InputType>, input: unknown, additional?: Additional) => ProcessResult

// StructureValidator

export type EmitStructureValidation = (value: unknown, additional?: Additional) => ErrorTree

// With

export type WithAsserion = (input: unknown, input2?: unknown, additional?: Additional) => void

export type WithRef = (refName: string, assertion: WithAsserion) => (input: unknown, additional?: Additional) => void
export type WithValue = (
  input2: unknown,
  assertion: WithAsserion,
  name?: string,
) => (input: unknown, additional?: Additional) => void
