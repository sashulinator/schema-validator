/* eslint-disable max-classes-per-file */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface BaseErrorProps<Errors = any> {
  code: string
  message: string
  errors?: Errors
}

export class BaseError<Errors = any> extends Error {
  public readonly _code: string // very handy when you need to translate or to give a more detailed information

  public readonly _message: string

  public readonly _errors?: any
  // depending on a context on a client side
  // example: you try to create a user and receive { errorCode: CONFLICT }
  // so you can show the message "Such user already exists"

  constructor(props: BaseErrorProps<Errors>) {
    super(props.message)
    this._code = props.code
    this._message = props.message

    if (props.errors) {
      this._errors = props.errors
    }
  }
}

export interface ValidationErrorProps<Errors = any> {
  code: string
  message: string
  inputName: string
  path: string
  input?: unknown
  inputName2?: string
  input2?: unknown
  errors?: Errors
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidationError<Errors = any> extends BaseError<Errors> {
  // can be a field name in a validated object
  _inputName: string

  // can be a field input in a validated object
  _input?: unknown

  // can be a pattern name (email, uuid), a measuring system (kg, m) or a limit name (card/phone number limit)
  _inputName2?: string

  // input that we somehow compared with ValidationError['input']
  _input2?: unknown

  // can be a field input in a validated object
  _path: string

  constructor(props: ValidationErrorProps<Errors>) {
    super({ ...props })

    this._inputName = props.inputName
    this._path = props.path

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
