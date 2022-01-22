// "Structure" means Object | Array

import { ValidationError } from './errors'

export type Schema = StructureSchema | EmitAssertValidation | EmitStructureValidation

export type StructureSchema = ArrayStructureSchema | ObjectStructureSchema

export type ArrayStructureSchema = (Schema | EmitAssertValidation | EmitStructureValidation)[]

export type ObjectStructureSchema = {
  [fieldName: string | number]: Schema | EmitAssertValidation | EmitStructureValidation
}

export type Structure = ArrayStructure | ObjectStructure

export type ArrayStructure = any[]

export type ObjectStructure = Record<string, any>

export type ErrorTree = Record<string, ValidationError> | ValidationError | undefined | Record<string, any>

export type Assertion = (value: unknown, key?: string, structure?: unknown) => void

export type ComparingAssertionArgs = [value: unknown, value2: any, key?: string, key2?: string, structure?: any]

export type ComparingAssertion = (...args: ComparingAssertionArgs) => void

export type AssertionItem =
  | Assertion
  | [ComparingAssertion, any | ((value: unknown, key?: string, structure?: ObjectStructure) => any), string?]

export type EmitAssertValidation = (value: unknown, key?: string, structure?: unknown) => ValidationError | undefined

export type EmitStructureValidation = (value: unknown, key?: string, structure?: unknown) => ErrorTree
