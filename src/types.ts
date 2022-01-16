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

export type Assertion = (value: any, key?: string, structure?: any) => void

export type ComparingAssertionArgs = [value: any, comparisonValue: any, key?: string, key2?: string, structure?: any]

export type ComparingAssertion = (...args: ComparingAssertionArgs) => void

export type AssertionItem =
  | Assertion
  | [ComparingAssertion, any | ((value: any, key?: string, structure?: ObjectStructure) => any), string?]

export type EmitAssertValidation = (value: any, key?: string, structure?: any) => ValidationError | undefined

export type EmitStructureValidation = (input: Structure, key?: string, structure?: any) => ErrorTree
