import { ValidationError } from './errors'
import { WithRef, WithAssertion, WithValue, Meta } from './types'

const handleAssertion = (assertion: WithAssertion, input: unknown, input2: unknown, meta: Meta, name?: string) => {
  try {
    assertion(input, input2, meta)
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    if (error instanceof Error) {
      throw new ValidationError({
        inputName: meta?.inputName,
        input,
        input2: input2?.toString(),
        inputName2: name,
        code: assertion?.name,
        message: error.message,
        path: meta.path,
      })
    }
  }
}

export const withRef: WithRef = (refName: string, assertion: WithAssertion) => {
  return function emitAssertion(input, meta) {
    const input2 = meta?.inputObject[refName]
    handleAssertion(assertion, input, input2, meta, refName)
  }
}

export const withValue: WithValue = (input2, assertion, name) => {
  return function emitAssertion(input, meta) {
    handleAssertion(assertion, input, input2, meta, name)
  }
}
