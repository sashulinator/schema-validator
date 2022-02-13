import { ValidationError } from './errors'
import { createStructureValidator } from './create-structure-validator'

export class SchemaStructureValidator<THandleErrors extends (errors: any, validationError?: ValidationError) => any> {
  private readonly handleErrors: THandleErrors

  constructor({ handleErrors }: { handleErrors: THandleErrors }) {
    this.handleErrors = handleErrors
  }

  public wrap = createStructureValidator(
    ({ errors }): ReturnType<THandleErrors> => {
      return errors
    },
  )

  public only = createStructureValidator(({ errors }) => {
    // if (unusedObjectKeys.length) {
    //   const excessiveKeysError = new ValidationError({
    //     inputName,
    //     input: unusedObjectKeys,
    //     code: 'excessiveKeys',
    //     message: 'some keys are excessive',
    //   })

    //   errorTree = this.handleErrors(errorTree, excessiveKeysError)
    // }

    return errors
  })
}
