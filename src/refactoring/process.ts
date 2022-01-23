import { ValidationError } from './errors'
import { isObject } from './is'
import { ObjectStructureSchema, Process, ProcessFactory } from './types'

export const processFactory: ProcessFactory = (schema, structure, additional) => {
  if (typeof schema === 'function') {
    const errorTree = schema(structure, additional)

    return {
      errorTree,
      unusedObjectKeys: [],
      unusedSchemaKeys: [],
    }
  }

  return processObject(schema, structure, additional)
}

const processObject: Process<ObjectStructureSchema> = (schema, input, additional) => {
  if (!isObject(input)) {
    return {
      unusedObjectKeys: [],
      unusedSchemaKeys: [],
      errorTree: new ValidationError({
        input,
        message: 'schema expects object',
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

    const { errorTree } = processFactory(schemaValue, objInput, { ...additional, inputName })
    localErrorTree[inputName] = errorTree
  }

  return {
    unusedObjectKeys,
    unusedSchemaKeys,
    errorTree: localErrorTree,
  }
}
