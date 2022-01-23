import { Additional } from '.'
import { ValidationError } from './errors'
import { WithRef, WithAsserion, WithValue } from './types'

const handleAssertion = (
  assertion: WithAsserion,
  input: unknown,
  input2: unknown,
  additional: Additional,
  name?: string,
) => {
  try {
    assertion(input, input2, additional)
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError({
        inputName: additional?.inputName,
        input,
        input2: input2.toString(),
        inputName2: name,
        code: assertion?.name,
        message: error.message,
      })
    }
  }
}

export const withRef: WithRef = (refName: string, assertion: WithAsserion) => {
  return function emitAssertion(input, additional) {
    const input2 = additional?.inputObject[refName]
    handleAssertion(assertion, input, input2, additional, refName)
  }
}

export const withValue: WithValue = (input2, assertion, name) => {
  return function emitAssertion(input, additional) {
    handleAssertion(assertion, input, input2, additional, name)
  }
}
