import { ValidationError } from './errors'
import { Primitive } from './types'

export const and: Primitive = (...assertionItems) => {
  return function emitAssertion(input, additional) {
    for (let index = 0; index < assertionItems.length; index += 1) {
      const assertion = assertionItems[index]

      try {
        assertion(input, additional)
      } catch (error) {
        if (error instanceof ValidationError) {
          return error
        }
        if (error instanceof Error) {
          return new ValidationError({
            inputName: additional?.inputName,
            input: input?.toString(),
            code: assertion?.name,
            message: error.message,
          })
        }
      }
    }

    return undefined
  }
}
