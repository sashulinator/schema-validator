import { ValidationError } from './errors'
import { WithRef, WithAsserion } from './types'

export const withRef: WithRef = (refName: string, assertion: WithAsserion) => {
  return function emitAssertion(input, additional) {
    const input2 = additional?.inputObject[refName]

    try {
      assertion(input, input2, additional)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError({
          inputName: additional?.inputName,
          input,
          input2: input2.toString(),
          inputName2: refName,
          code: assertion?.name,
          message: error.message,
        })
      }
    }
  }
}
