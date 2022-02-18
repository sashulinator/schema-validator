import { and } from '.'
import { Primitive } from './types'

export const or: Primitive = (...assertionItems) => {
  return function emitAssertion(input, meta) {
    let localErrors: any

    for (let index = 0; index < assertionItems.length; index += 1) {
      const assertion = assertionItems[index]

      const error = and(assertion)(input, meta)

      if (error) {
        localErrors = meta.handleErrors(localErrors, error, meta)
      }
    }

    return localErrors
  }
}
