/* eslint-disable max-classes-per-file */
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export class ErrorWithCode extends Error {
  public readonly code: string // very handy when you need to translate

  constructor(message: string, code: string) {
    super(message)

    Object.defineProperty(this, 'message', {
      value: message,
      writable: true,
      enumerable: true,
    })

    this.code = code
  }
}

export interface ValidationErrorProps {
  message: string
  code: string
  input: unknown
  inputName: string
  path: string
  input2?: unknown
  inputName2?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidationError extends ErrorWithCode {
  input: unknown

  inputName: string

  path: string

  // can be a pattern name (email, uuid), a measuring system (kg, m) or a limit name (card/phone number limit)
  inputName2?: string

  // input that we somehow compared with input
  input2?: unknown

  constructor(props: ValidationErrorProps) {
    super(props.message, props.code)

    this.inputName = props.inputName
    this.path = props.path

    if (props.input) {
      this.input = props.input
    }

    if (props.inputName2) {
      this.inputName2 = props.inputName2
    }

    if (props.input2) {
      this.input2 = props.input2
    }
  }
}
