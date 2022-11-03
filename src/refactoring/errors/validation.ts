import { CodeError } from './code'

interface Props {
  message: string
  code: string
  input: unknown
  inputName?: string
  relative?: unknown
  relativeName?: string
  path?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidationError extends CodeError {
  input: unknown

  inputName?: string

  // value that we use somehow to compare with input or show relationship between them
  relative?: unknown

  // can be a pattern name (email, uuid), a measuring system (kg, m) or a limit name (card/phone number limit)
  relativeName?: string

  path?: string[]

  constructor(props: Props) {
    super(props.message, props.code)

    this.input = props.input

    if (props.inputName) {
      this.inputName = props.inputName
    }
    if (props.relative) {
      this.relative = props.relative
    }
    if (props.relativeName) {
      this.relativeName = props.relativeName
    }
    if (props.path) {
      this.path = props.path
    }
  }
}
