import { isPrimitive, Meta, ValidationError } from '.'

export function catchError(error: Error, input: unknown, meta: Meta, code?: string): any {
  // assertion can be withValue or withRef and they throw their own ValidationError
  if (error instanceof ValidationError) {
    return error
  }
  if (error instanceof Error) {
    return new ValidationError({
      inputName: meta?.inputName,
      input: isPrimitive(input) ? input : input?.toString(),
      code,
      message: error.message,
      path: meta.path,
    })
  }
}
