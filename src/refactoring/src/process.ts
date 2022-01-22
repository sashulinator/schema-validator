import { ValidationError } from './errors'
import { isObject } from './is'
import { ErrorTree, ObjectStructureSchema, Process, ProcessFactory } from './types'

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

  const localErrorTree: Record<string, ErrorTree> = {}
  const schemaEntries = Object.entries(schema)
  let unusedObjectKeys = Object.keys(input)
  const unusedSchemaKeys = []

  for (let index = 0; index < schemaEntries.length; index += 1) {
    const [objKey, schemaValue] = schemaEntries[index]
    const objinput = input?.[objKey]

    unusedObjectKeys = unusedObjectKeys.filter((inputName) => inputName !== objKey)

    if (objinput === undefined) {
      unusedSchemaKeys.push(objKey)
    }

    const { errorTree } = processFactory(schemaValue, objinput, additional)
    localErrorTree[objKey] = errorTree
  }

  return {
    unusedObjectKeys,
    unusedSchemaKeys,
    errorTree: localErrorTree,
  }
}
