import { processFactory } from '.'
import isPromise, { isEmpty } from './is'
import { Meta, SchemaCollector } from './types'

export const or: SchemaCollector = (...schemas) => {
  return function emitSchemaCollector(input, meta) {
    const errorCollection: any[] = []

    const promises: Promise<any>[] = []
    const metas: Meta[] = []

    for (let index = 0; index < schemas.length; index += 1) {
      const schema = schemas[index]

      const errors = processFactory(schema, input, meta)

      if (isPromise(errors)) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        promises.push(errors)
        metas.push(meta)
      } else if (errors) {
        errorCollection.push(errors)
      }
    }

    if (isEmpty(promises)) {
      if (errorCollection.length === schemas.length) {
        return errorCollection[0]
      }
      return
    }

    return Promise.all(promises).then((res: any[]): any => {
      for (let i = 0; i < res.length; i += 1) {
        const error = res[i]
        if (error) {
          errorCollection.push(error)
        }
      }

      if (errorCollection.length === schemas.length) {
        return errorCollection[0]
      }
      return undefined
    })
  }
}
