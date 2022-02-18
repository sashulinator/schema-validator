/* eslint-disable max-classes-per-file */
interface BaseErrorProps {
  code: string
  message: string
  errors?: { [inputNameFromCollectableError: string]: ValidationError } | ValidationError
}

export class BaseError extends Error {
  public readonly _code: string // very handy when you need to translate or to give a more detailed information

  public readonly _message: string

  public readonly _errors?: { [inputNameFromCollectableError: string]: ValidationError } | ValidationError
  // depending on a context on a client side
  // example: you try to create a user and receive { errorCode: CONFLICT }
  // so you can show the message "Such user already exists"

  constructor(props: BaseErrorProps) {
    super(props.message)
    this._code = props.code
    this._message = props.message

    if (props.errors) {
      this._errors = props.errors
    }
  }
}

export interface ValidationErrorProps {
  code: string
  message: string
  inputName: string
  input?: unknown
  inputName2?: string
  input2?: unknown
}

export class ValidationError extends BaseError {
  // can be a field name in a validated object
  _inputName: string

  // can be a field input in a validated object
  _input?: unknown

  // can be a pattern name (email, uuid), a measuring system (kg, m) or a limit name (card/phone number limit)
  _inputName2?: string

  // input that we somehow compared with ValidationError['input']
  _input2?: unknown

  constructor(props: ValidationErrorProps) {
    super({ ...props })

    this._inputName = props.inputName

    if (props.input) {
      this._input = props.input
    }

    if (props.inputName2) {
      this._inputName2 = props.inputName2
    }

    if (props.input2) {
      this._input2 = props.input2
    }
  }
}
