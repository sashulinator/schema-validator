import { ValidationError } from './errors'
import { Primitive } from './types'

export const primitive: Primitive = (...assertionItems) => {
  return function emitAssertion(input, additional) {
    for (let index = 0; index < assertionItems.length; index += 1) {
      const assertion = assertionItems[index]

      try {
        assertion(input, additional)
      } catch (error) {
        if (error instanceof Error) {
          return new ValidationError({
            inputName: additional?.inputName,
            input,
            code: assertion?.name,
            message: error.message,
          })
        }
      }
    }

    return undefined
  }
}
