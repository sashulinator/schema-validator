import { ValidateStructure } from '.'
import { processFactory } from './process'
import { Meta, ErrorCollector, Schema } from './types'

export function createStructureValidator<TErrors>(validateStructure?: ValidateStructure<TErrors>) {
  return function structureValidator<InputType, TSchema extends Schema<InputType> = Schema<InputType>>(
    schema: TSchema,
  ): TSchema & ErrorCollector<TErrors> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this

    function emitStructureValidator(input: unknown, meta: Meta): ReturnType<ErrorCollector<TErrors>> {
      const handleError = this?.handleError || that?.handleError || meta?.handleError
      if (!handleError) {
        throw new Error('"handleError" is not provided!')
      }

      const newMeta = { path: '', handleError, ...meta }

      const structureError = validateStructure?.(schema, input, meta)

      const errors = processFactory(schema, input, newMeta)

      if (errors || structureError) {
        return handleError(errors, structureError, newMeta)
      }

      return undefined
    }

    Object.entries(schema).forEach(([schemaKey, schemaValue]) => {
      Object.defineProperty(emitStructureValidator, schemaKey, { value: schemaValue, writable: true, enumerable: true })
    })

    return emitStructureValidator as TSchema & ErrorCollector<TErrors>
  }
}

export const buildObjectByPath = (
  obj: Record<string, unknown>,
  pathString: string,
  value: any = null,
): Record<string, unknown> => {
  let paths = pathString.split('.')
  let current = obj
  while (paths.length > 1) {
    const [head, ...tail] = paths
    paths = tail
    if (current[head] === undefined) {
      current[head] = {}
    }
    current = current[head] as Record<string, unknown>
  }
  if (value) {
    const oldValue = current[paths[0]] as any
    current[paths[0]] = { ...oldValue, ...value }
  }
  return obj
}
