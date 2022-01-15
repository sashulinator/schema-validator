/* eslint-disable no-else-return */
import {
  ArrayStructure,
  ArrayStructureSchema,
  ErrorTree,
  ObjectStructure,
  ObjectStructureSchema,
  Schema,
  Structure,
  StructureSchema,
} from './types'

export type ProcessResult = {
  errorTree: ErrorTree
  unusedObjectKeys: string[]
  unusedSchemaKeys: string[]
}

type Process<SC extends StructureSchema, ST extends Structure> = (schema: SC, structure: ST) => ProcessResult

export function processOrEmit(schema: Schema, structure: Structure, key?: string): ProcessResult {
  if (typeof schema === 'function') {
    return {
      errorTree: schema(structure, key),
      unusedObjectKeys: [],
      unusedSchemaKeys: [],
    }
  } else if (structure === undefined) {
    return {
      errorTree: undefined,
      unusedObjectKeys: [],
      unusedSchemaKeys: [],
    }
  } else {
    return process(schema, structure)
  }
}

export function removeErrorTreeIfEmpty(errorTree: ErrorTree): ErrorTree {
  return Object.values(errorTree).find(Boolean) ? errorTree : undefined
}

const processArray: Process<ArrayStructureSchema, ArrayStructure> = (schema, arrayStructure) => {
  const localErrorTree: Record<string, any> = {}

  if (schema.length > 1) {
    throw Error(
      'Schema Error: Array in a schema cannot have length more than 1. Maybe you want to export functions "or" or "and"',
    )
  }

  for (let index = 0; index < arrayStructure.length; index += 1) {
    const key = index.toString()
    const { errorTree } = processOrEmit(schema[0], arrayStructure?.[index], key)
    localErrorTree[key] = errorTree
  }

  return {
    errorTree: removeErrorTreeIfEmpty(localErrorTree),
    unusedObjectKeys: [],
    unusedSchemaKeys: [],
  }
}

const processObject: Process<ObjectStructureSchema, ObjectStructure> = (schema, objectStructure) => {
  const localErrorTree: ErrorTree = {}
  const schemaEntries = Object.entries(schema)
  let unusedObjectKeys = Object.keys(objectStructure)
  const unusedSchemaKeys = []

  for (let index = 0; index < schemaEntries.length; index += 1) {
    const [objKey, schemaValue] = schemaEntries[index]
    const objValue = objectStructure?.[objKey]

    unusedObjectKeys = unusedObjectKeys.filter((key) => key !== objKey)

    if (objValue === undefined) {
      unusedSchemaKeys.push(objKey)
    }

    const { errorTree } = processOrEmit(schemaValue, objValue, objKey)
    localErrorTree[objKey] = errorTree
  }

  return {
    unusedObjectKeys,
    unusedSchemaKeys,
    errorTree: removeErrorTreeIfEmpty(localErrorTree),
  }
}

export const process: Process<StructureSchema, Structure> = (schema, structure) => {
  if (Array.isArray(structure)) {
    return processArray(schema as ArrayStructureSchema, structure)
  } else {
    return processObject(schema as ObjectStructureSchema, structure)
  }
}
