import { Assertion, ErrorCollection, ErrorCollector, isEmpty } from '.'
import { catchError } from './catch-error'
import { ValidationError } from './errors'
import { isObject, isPromise } from './is'
import { ArrayStructureSchema, Meta, ObjectStructureSchema, Process, ProcessFactory, ANY_KEY } from './types'

export const processFactory: ProcessFactory = (schema, input, meta) => {
  if (typeof schema === 'function') {
    return processFunction(schema, input, meta)
  }

  if (Array.isArray(schema)) {
    return processArray(schema, input, meta)
  }

  if (isObject(schema)) {
    return processObject(schema, input, meta)
  }

  throw Error('Schema must be a function, array or object!')
}

export const processFunction: Process<ErrorCollector<ErrorCollection> | Assertion> = (fn, input, meta) => {
  try {
    const result = fn(input, meta)

    if (isPromise(result)) {
      return fn(input, meta).catch((error: Error) => {
        return catchError(error, input, meta, fn.name)
      })
    }

    return result
  } catch (error) {
    return catchError(error, input, meta, fn.name)
  }
}

const processObject: Process<ObjectStructureSchema<Record<string, unknown>>> = (schema, input, meta) => {
  if (!isObject(input)) {
    return new ValidationError({
      input,
      message: 'schema expects an object',
      inputName: meta.inputName,
      code: 'schemaExpectsObject',
      path: meta.path,
    })
  }

  let errorCollection: ErrorCollection
  const schemaEntries = Object.entries(schema)
  const inputEntries = Object.entries(input)

  const isAnyKey = schemaEntries.some(([schemaKey]) => schemaKey === ANY_KEY)

  if (isAnyKey && schemaEntries.length > 1) {
    throw new Error('Schema with "ANY_KEY" must contain only one value with this key')
  }

  const promises: Promise<any>[] = []
  const metas: Meta[] = []

  if (Object.keys(schema)[0] === ANY_KEY) {
    for (let index = 0; index < inputEntries.length; index += 1) {
      const [inputName, objInput] = inputEntries[index]
      const [, schemaValue] = schemaEntries[0]
      const parentPath = meta.path ? `${meta.path}.` : ''
      const path = `${parentPath}${inputName}`
      const newMeta = { ...meta, inputName, inputObject: input, path }

      const errors = processFactory(schemaValue, objInput, newMeta)

      if (isPromise(errors)) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        promises.push(errors)
        metas.push(newMeta)
      } else if (errors) {
        errorCollection = meta.handleError(errorCollection, errors, newMeta)
      }
    }
  } else {
    for (let index = 0; index < schemaEntries.length; index += 1) {
      const [inputName, schemaValue] = schemaEntries[index]
      const objInput = input?.[inputName]
      const parentPath = meta.path ? `${meta.path}.` : ''
      const path = `${parentPath}${inputName}`
      const newMeta = { ...meta, inputName, inputObject: input, path }

      const errors = processFactory(schemaValue, objInput, newMeta)

      if (isPromise(errors)) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        promises.push(errors)
        metas.push(newMeta)
      } else if (errors) {
        errorCollection = meta.handleError(errorCollection, errors, newMeta)
      }
    }
  }

  if (isEmpty(promises)) {
    return errorCollection
  }

  return Promise.all(promises).then((res: any[]): any => {
    for (let i = 0; i < res.length; i += 1) {
      const element = res[i]
      const nmeta = metas[i]
      errorCollection = nmeta.handleError(errorCollection, element, nmeta)
    }
    return errorCollection
  })
}

const processArray: Process<ArrayStructureSchema<unknown>> = (schema, input, meta) => {
  if (!Array.isArray(input)) {
    return new ValidationError({
      input,
      message: 'schema expects an array',
      inputName: meta.inputName,
      code: 'schemaExpectsArray',
      path: meta.path,
    })
  }

  if (schema.length > 1) {
    throw Error('Schema Error: Array in a schema cannot have length more than 1. Maybe you want to use function "or"')
  }

  let errorCollection: ErrorCollection

  const promises: Promise<any>[] = []
  const metas: Meta[] = []

  for (let index = 0; index < input.length; index += 1) {
    const inputName = index.toString()
    const parentPath = meta.path ? `${meta.path}.` : ''
    const path = `${parentPath}${inputName}`
    const newMeta = { ...meta, inputName, path }
    const errors = processFactory(schema[0], input?.[index], newMeta)

    if (isPromise(errors)) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      promises.push(errors)
      metas.push(newMeta)
    } else if (errors) {
      errorCollection = meta.handleError(errorCollection, errors, newMeta)
    }
  }

  if (isEmpty(promises)) {
    return errorCollection
  }

  return Promise.all(promises).then((res: any[]): any => {
    for (let i = 0; i < res.length; i += 1) {
      const element = res[i]
      const nmeta = metas[i]
      errorCollection = nmeta.handleError(errorCollection, element, nmeta)
    }
    return errorCollection
  })
}
