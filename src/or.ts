import { processOrEmit } from './process'
import { ErrorTree, Schema, Structure } from './types'

export function or(...schemas: Schema[]) {
  return function emitOr(structure: Structure, key?: string, parentStructure?: Structure): ErrorTree {
    const localErrorTree: Record<string, any> = {}

    for (let index = 0; index < schemas.length; index += 1) {
      const schema = schemas[index]

      const { errorTree } = processOrEmit(schema, structure, key, parentStructure)

      localErrorTree[index.toString()] = errorTree
    }

    const errorValues = Object.values(localErrorTree)

    return errorValues.every(Boolean) ? errorValues.reduce((acc, error) => ({ ...acc, ...error }), {}) : undefined
  }
}
