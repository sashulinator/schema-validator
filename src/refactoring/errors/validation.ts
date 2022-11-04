import { CodeError } from './code'

interface Props {
  message: string
  code: string
  input: unknown
  inputName?: string | number
  relative?: unknown
  relativeName?: string | number
  path?: (string | number)[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidationError extends CodeError {
  input: unknown

  inputName?: string | number

  // value that we use somehow to compare with input or show relationship between them
  relative?: unknown

  // can be a pattern name (email, uuid), a measuring system (kg, m) or a limit name (card/phone number limit)
  relativeName?: string | number

  path?: (string | number)[]

  constructor(props: Props) {
    super(props.message, props.code)

    this.input = props.input

    if (props.inputName !== undefined) {
      this.inputName = props.inputName
    }
    if (props.relative !== undefined) {
      this.relative = props.relative
    }
    if (props.relativeName !== undefined) {
      this.relativeName = props.relativeName
    }
    if (Array.isArray(props.path)) {
      this.path = props.path
    }
  }
}
