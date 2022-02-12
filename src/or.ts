import { and } from '.'
import { Primitive } from './types'

export const or: Primitive = (...assertionItems) => {
  return function emitAssertion(input, additional) {
    let localErrors: any

    for (let index = 0; index < assertionItems.length; index += 1) {
      const assertion = assertionItems[index]

      const error = and(assertion)(input, additional)

      if (error) {
        localErrors = additional.handleErrors(localErrors, error)
      }
    }

    return localErrors
  }
}
