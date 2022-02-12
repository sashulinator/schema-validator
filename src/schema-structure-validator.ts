import { ValidationError } from './errors'
import { createStructureValidator } from './create-structure-validator'

export class SchemaStructureValidator<THandleErrors extends (errors: any, validationError?: ValidationError) => any> {
  private readonly handleErrors: THandleErrors

  constructor({ handleErrors }: { handleErrors: THandleErrors }) {
    this.handleErrors = handleErrors
  }

  public wrap = createStructureValidator(
    ({ errorTree }): ReturnType<THandleErrors> => {
      return this.handleErrors(errorTree)
    },
  )

  public only = createStructureValidator(({ errorTree, unusedObjectKeys, inputName }) => {
    if (unusedObjectKeys.length) {
      const excessiveKeysError = new ValidationError({
        inputName,
        input: unusedObjectKeys,
        code: 'excessiveKeys',
        message: 'some keys are excessive',
      })

      errorTree = this.handleErrors(errorTree, excessiveKeysError)
    }

    return errorTree
  })
}
