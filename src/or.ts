import { processOrEmit } from './process'
import { ErrorTree, Schema } from './types'

export function or(...schemas: Schema[]) {
  return function emitOr(obj: Record<string, any>, key?: string): ErrorTree {
    const localErrorTree: Record<string, any> = {}

    for (let index = 0; index < schemas.length; index += 1) {
      const schema = schemas[index]

      const { errorTree } = processOrEmit(schema, obj, key)

      localErrorTree[index.toString()] = errorTree
    }

    const errorValues = Object.values(localErrorTree)

    return errorValues.every(Boolean) ? errorValues.reduce((acc, error) => ({ ...acc, ...error }), {}) : undefined
  }
}
