import { ValidationError } from './errors'

// Common

export type Additional = {
  inputName: string | undefined
  inputObject: Record<string, unknown> | undefined
  initialInput: unknown | undefined
  payload: unknown
}

// Primitive

export type Primitive = (...assertions: Assertion[]) => EmitAssertion //

export type Assertion = (input: unknown, additional: Additional) => void

export type ErrorTree = Record<string, ValidationError> | ValidationError | undefined

export type EmitAssertion = (input: unknown, additional: Additional) => ValidationError
