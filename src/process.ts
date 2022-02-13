import { CollectedErrors } from '.'
import { and } from './and'
import { ValidationError } from './errors'
import { isObject } from './is'
import { ArrayStructureSchema, ObjectStructureSchema, Process, ProcessFactory } from './types'

export const processFactory: ProcessFactory = (schema, input, additional) => {
  if (typeof schema === 'function') {
    let collectedErrors: CollectedErrors

    try {
      collectedErrors = schema(input, additional)
    } catch (e) {
      collectedErrors = and(schema)(input, additional)
    }

    return collectedErrors
  }
  if (Array.isArray(schema)) {
    // return processArray(schema, input, additional)
    return
  }

  return processObject(schema, input, additional)
}

const processObject: Process<ObjectStructureSchema<Record<string, unknown>>> = (schema, input, additional) => {
  if (!isObject(input)) {
    return new ValidationError({
      input,
      message: 'schema expects an object',
      inputName: additional.inputName,
      code: 'schemaExpectsObject',
    })
  }

  let collectedErrors: CollectedErrors
  const schemaEntries = Object.entries(schema)

  for (let index = 0; index < schemaEntries.length; index += 1) {
    const [inputName, schemaValue] = schemaEntries[index]
    const objInput = input?.[inputName]

    const errors = processFactory(schemaValue, objInput, { ...additional, inputName, inputObject: input })
    collectedErrors = additional.handleErrors(collectedErrors, errors)
  }

  return collectedErrors
}

const processArray: Process<ArrayStructureSchema<unknown>> = (schema, input, additional) => {
  let collectedErrors: CollectedErrors

  if (!Array.isArray(input)) {
    return new ValidationError({
      input,
      message: 'schema expects an array',
      inputName: additional.inputName,
      code: 'schemaExpectsArray',
    })
  }

  if (schema.length > 1) {
    throw Error('Schema Error: Array in a schema cannot have length more than 1. Maybe you want to use function "or"')
  }

  for (let index = 0; index < input.length; index += 1) {
    const inputName = index.toString()
    const errors = processFactory(schema[0], input?.[index], { ...additional, inputName })
    collectedErrors = additional.handleErrors(collectedErrors, errors)
  }

  return collectedErrors
}
