/* eslint-disable max-classes-per-file */
interface BaseErrorProps {
  code: string
  message: string
  errors?: { [keyFromCollectableError: string]: CollectableError } | CollectableError
}

export class BaseError extends Error {
  public readonly _code: string // very handy when you need to translate or to give a more detailed information

  public readonly _message: string

  public readonly _errors?: { [keyFromCollectableError: string]: CollectableError } | CollectableError
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

export interface CollectableErrorProps {
  code: string
  message: string
  key: string
  value?: unknown
  key2?: string
  value2?: unknown
}

export class CollectableError extends BaseError {
  // can be a field name in a validated object
  _key: string

  // can be a field value in a validated object
  _value?: unknown

  // can be a pattern name (email, uuid), a measuring system (kg, m) or a limit name (card/phone number limit)
  _key2?: string

  // value that we somehow compared with ValidationError['value']
  _value2?: unknown

  constructor(props: CollectableErrorProps) {
    super({ ...props })

    this._key = props.key

    if (props.value) {
      this._value = props.value
    }

    if (props.key2) {
      this._key2 = props.key2
    }

    if (props.value2) {
      this._value2 = props.value2
    }
  }
}

export class ValidationError extends CollectableError {}
