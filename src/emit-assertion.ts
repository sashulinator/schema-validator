import { EmitAssertion, isPrimitive, ValidationError } from '.'

export const emitAssertion: EmitAssertion = (assertion, input, meta) => {
  try {
    assertion?.(input, meta)
  } catch (error) {
    // assertion can be withValue or withRef and they throw their own ValidationError
    if (error instanceof ValidationError) {
      return error
    }
    if (error instanceof Error) {
      return new ValidationError({
        inputName: meta?.inputName,
        input: isPrimitive(input) ? input : input?.toString(),
        code: assertion?.name,
        message: error.message,
      })
    }
  }

  return undefined
}
