import { ValidationError } from './errors'

// Common

export type Schema = StructureSchema | EmitAssertion

export type StructureSchema =
  // | ArrayStructureSchema
  ObjectStructureSchema

// export type ArrayStructureSchema = (Schema | EmitAssertion)[]

export type ObjectStructureSchema = {
  [fieldName: string]: Schema | EmitAssertion
}

export type Additional = {
  inputName: string | undefined
  inputObject: Record<string, unknown> | undefined
  initialInput: unknown | undefined
  payload: unknown
}

// Primitive

export type Primitive = (...assertions: Assertion[]) => EmitAssertion

export type Assertion = (input: unknown, additional: Additional) => void

export type ErrorTree<T extends unknown = unknown> = Record<string, ValidationError> | ValidationError | unknown | T

export type EmitAssertion = (input: unknown, additional: Additional) => ValidationError

// Process

export type ProcessResult = {
  errorTree: ErrorTree
  unusedObjectKeys: string[]
  unusedSchemaKeys: string[]
}

export type ProcessFactory = (schema: Schema, input: unknown, additional: Additional) => ProcessResult

export type Process<SC extends StructureSchema> = (schema: SC, input: unknown, additional: Additional) => ProcessResult

// StructureValidator

export type EmitStructureValidation = (value: unknown, key?: string, structure?: unknown) => ErrorTree
