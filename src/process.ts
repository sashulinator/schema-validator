import { CollectedErrors } from '.'
import { and } from './and'
import { ValidationError } from './errors'
import { isObject } from './is'
import { ArrayStructureSchema, EmitAssertion, ObjectStructureSchema, Process, ProcessFactory } from './types'

export const processFactory: ProcessFactory = (schema, input, meta, cb) => {
  if (typeof schema === 'function') {
    return processFunction(schema, input, meta, cb)
  }

  if (Array.isArray(schema)) {
    return processArray(schema, input, meta, cb)
  }

  if (isObject(schema)) {
    return processObject(schema, input, meta, cb)
  }

  throw Error('Schema must be a function, array or object!')
}

const processFunction: Process<EmitAssertion> = (schema, input, meta, cb) => {
  let collectedErrors: CollectedErrors

  try {
    collectedErrors = schema(input, meta)
  } catch (e) {
    collectedErrors = and(schema)(input, meta)
  }

  return collectedErrors
}

const processObject: Process<ObjectStructureSchema<Record<string, unknown>>> = (schema, input, meta, cb) => {
  if (!isObject(input)) {
    return new ValidationError({
      input,
      message: 'schema expects an object',
      inputName: meta.inputName,
      code: 'schemaExpectsObject',
    })
  }

  let collectedErrors: CollectedErrors
  const schemaEntries = Object.entries(schema)

  for (let index = 0; index < schemaEntries.length; index += 1) {
    const [inputName, schemaValue] = schemaEntries[index]
    const objInput = input?.[inputName]
    const parentPath = meta.path ? `${meta.path}.` : ''
    const path = `${parentPath}${inputName}`
    const newMeta = { ...meta, inputName, inputObject: input, path }

    const errors = processFactory(schemaValue, objInput, newMeta)
    collectedErrors = meta.handleErrors(collectedErrors, errors, newMeta)
  }

  const customError = cb?.(schema, input, meta)
  collectedErrors = meta.handleErrors(collectedErrors, customError, meta)

  return collectedErrors
}

const processArray: Process<ArrayStructureSchema<unknown>> = (schema, input, meta, cb) => {
  let collectedErrors: CollectedErrors

  if (!Array.isArray(input)) {
    return new ValidationError({
      input,
      message: 'schema expects an array',
      inputName: meta.inputName,
      code: 'schemaExpectsArray',
    })
  }

  if (schema.length > 1) {
    throw Error('Schema Error: Array in a schema cannot have length more than 1. Maybe you want to use function "or"')
  }

  for (let index = 0; index < input.length; index += 1) {
    const inputName = index.toString()
    const parentPath = meta.path ? `${meta.path}.` : ''
    const path = `${parentPath}${inputName}`
    const newMeta = { ...meta, inputName, path }
    const errors = processFactory(schema[0], input?.[index], newMeta)
    collectedErrors = meta.handleErrors(collectedErrors, errors, newMeta)
  }

  const customError = cb?.(schema, input, meta)
  collectedErrors = meta.handleErrors(collectedErrors, customError, meta)

  return collectedErrors
}
