import { ErrorCollection, processFactory } from '.'
import { isPromise, isEmpty } from './is'
import { Meta, LogicalOperator } from './types'

export const and: LogicalOperator = (...schemas) => {
  return function emitSchemaCollector(input, meta) {
    const promises: Promise<ErrorCollection>[] = []
    const metas: Meta[] = []

    for (let index = 0; index < schemas.length; index += 1) {
      const schema = schemas[index]

      const errors = processFactory(schema, input, meta)

      if (isPromise(errors)) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        promises.push(errors)
        metas.push(meta)
      } else if (errors && promises.length === 0) {
        return errors
      }
    }

    if (!isEmpty(promises)) {
      return Promise.all(promises).then(
        (res: ErrorCollection[]): ErrorCollection => {
          for (let i = 0; i < res.length; i += 1) {
            const error = res[i]
            if (error) {
              return error
            }
          }
        },
      )
    }
  }
}
