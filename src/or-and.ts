import { processOrEmit } from './process'
import { ErrorTree, Schema } from './types'

export function or(schema1: Schema, schema2: Schema) {
  return function emitOr(obj: Record<string, any>, key: string): ErrorTree {
    const { errorTree: schemaErrors1 } = processOrEmit(schema1, obj, key)
    const { errorTree: schemaErrors2 } = processOrEmit(schema2, obj, key)

    if (schemaErrors1 && schemaErrors2) {
      return { ...schemaErrors2, ...schemaErrors1 }
    }

    return undefined
  }
}

export function and(schema1: Schema, schema2: Schema) {
  return function emitOr(obj: Record<string, any>, key: string): ErrorTree {
    const { errorTree: schemaErrors1 } = processOrEmit(schema1, obj, key)
    const { errorTree: schemaErrors2 } = processOrEmit(schema2, obj, key)

    if (schemaErrors1 || schemaErrors2) {
      return { ...schemaErrors2, ...schemaErrors1 }
    }

    return undefined
  }
}
