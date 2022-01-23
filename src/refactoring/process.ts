import { ValidationError } from './errors'
import { isObject } from './is'
import { ArrayStructureSchema, ObjectStructureSchema, Process, ProcessFactory } from './types'

export const processFactory: ProcessFactory = (schema, input, additional) => {
  if (typeof schema === 'function') {
    const errorTree = schema(input, additional)

    return {
      errorTree,
      unusedObjectKeys: [],
      unusedSchemaKeys: [],
    }
  }
  if (Array.isArray(schema)) {
    return processArray(schema, input, additional)
  }

  return processObject(schema, input, additional)
}

const processObject: Process<ObjectStructureSchema> = (schema, input, additional) => {
  if (!isObject(input)) {
    return {
      unusedObjectKeys: [],
      unusedSchemaKeys: [],
      errorTree: new ValidationError({
        input,
        message: 'schema expects an object',
        inputName: additional.inputName,
        code: 'schemaExpectsObject',
      }),
    }
  }

  const localErrorTree: Record<string, unknown> = {}
  const schemaEntries = Object.entries(schema)
  let unusedObjectKeys = Object.keys(input)
  const unusedSchemaKeys = []

  for (let index = 0; index < schemaEntries.length; index += 1) {
    const [inputName, schemaValue] = schemaEntries[index]
    const objInput = input?.[inputName]

    unusedObjectKeys = unusedObjectKeys.filter((objKey) => objKey !== inputName)

    if (objInput === undefined) {
      unusedSchemaKeys.push(inputName)
    }

    const { errorTree } = processFactory(schemaValue, objInput, { ...additional, inputName, inputObject: input })
    localErrorTree[inputName] = errorTree
  }

  return {
    unusedObjectKeys,
    unusedSchemaKeys,
    errorTree: localErrorTree,
  }
}

const processArray: Process<ArrayStructureSchema> = (schema, input, additional) => {
  const localErrorTree: Record<string, unknown> = {}

  if (!Array.isArray(input)) {
    return {
      unusedObjectKeys: [],
      unusedSchemaKeys: [],
      errorTree: new ValidationError({
        input,
        message: 'schema expects an array',
        inputName: additional.inputName,
        code: 'schemaExpectsArray',
      }),
    }
  }

  if (schema.length > 1) {
    throw Error('Schema Error: Array in a schema cannot have length more than 1. Maybe you want to use function "or"')
  }

  for (let index = 0; index < input.length; index += 1) {
    const inputName = index.toString()
    const { errorTree } = processFactory(schema[0], input?.[index], { ...additional, inputName })
    localErrorTree[inputName] = errorTree
  }

  return {
    errorTree: localErrorTree,
    unusedObjectKeys: [],
    unusedSchemaKeys: [],
  }
}
