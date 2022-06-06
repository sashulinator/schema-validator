import { ErrorCollection } from '.'
import isPromise from './is'
import { processFactory } from './process'
import { Meta, Schema, StructureAssertion } from './types'

export default function createStructureValidatorEmitter<TErrors extends ErrorCollection | undefined>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Schema<unknown>,
  structureValidator: StructureAssertion,
  parentHandleError: Meta<TErrors>['handleError'],
) {
  return function structureValidatorEmitter(input: unknown, meta?: Partial<Meta>): TErrors | Promise<TErrors> {
    const handleError = this?.handleError || meta?.handleError || parentHandleError

    if (!handleError) {
      throw new Error('"handleError" is not provided!')
    }

    const newMeta = { path: '', handleError, ...meta }

    const structureError = structureValidator?.(schema, input, newMeta)

    const errors = processFactory(schema, input, newMeta)

    if (isPromise(errors)) {
      return errors.then((pErrors: TErrors) => {
        return handleError(pErrors, structureError, newMeta)
      })
    }

    if (errors || structureError) {
      return handleError(errors, structureError, newMeta)
    }

    return undefined
  }
}
