import { ValidationError } from './errors'

export type Schema =
  | { [fieldName: string]: Schema | EmitAssertValidation | EmitStructureValidation }
  | (Schema | EmitAssertValidation | EmitStructureValidation)[]
  | EmitAssertValidation
  | EmitStructureValidation

export type StructureSchema = ArrayStructureSchema | ObjectStructureSchema

export type ArrayStructureSchema = (Schema | EmitAssertValidation | EmitStructureValidation)[]

export type ObjectStructureSchema = { [fieldName: string]: Schema | EmitAssertValidation | EmitStructureValidation }

export type Structure = ArrayStructure | ObjectStructure

export type ArrayStructure = any[]

export type ObjectStructure = Record<string, any>

export type ErrorTree = Record<string, ValidationError> | ValidationError | undefined | Record<string, any>

export type Assertion = (value: any) => void

export type ComparingAssertion = (value: any, comparisonValue: any) => void

export type AssertionItem = Assertion | [ComparingAssertion, any, string?]

export type EmitAssertValidation = (value: any, key?: string, isThrowError?: boolean) => ValidationError | undefined

export type EmitStructureValidation = (input: Structure, key?: string, isThrowError?: boolean) => ErrorTree
