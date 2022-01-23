import { processFactory } from './process'
import { removeEmpty } from './remove-empty'
import { Additional, EmitStructureValidation, ErrorTree, ProcessResult, Schema } from './types'

type StructureValidatorCbParams = ProcessResult & {
  input: unknown
  inputName: string
  schema: Schema
}

export type EmitStructureValidator = (input: unknown, additional: Additional) => ErrorTree

export function createStructureValidator(cb: (processResult: StructureValidatorCbParams) => ErrorTree) {
  return <SC extends Schema>(schema: SC): SC & EmitStructureValidation => {
    const emitStructureValidator: EmitStructureValidator = (input, additional) => {
      const processResult = processFactory(schema, input, additional)

      return cb({
        ...processResult,
        ...additional,
        errorTree: removeEmpty(processResult.errorTree),
        input,
        schema,
      })
    }

    const schemaKeys = Object.keys(schema)

    for (let index = 0; index < schemaKeys.length; index += 1) {
      const key = schemaKeys[index]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.defineProperty(emitStructureValidator, key, { value: schema[key], writable: true, enumerable: true })
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return emitStructureValidator
  }
}
