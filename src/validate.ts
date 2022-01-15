import { ValidationError } from './errors'
import { AssertionItem, EmitAssertValidation } from './types'

export function validate(assertionItems: AssertionItem[]): EmitAssertValidation {
  return function emitAssertValidation(value, key) {
    for (let index = 0; index < assertionItems.length; index += 1) {
      const assertionItem = assertionItems[index]
      const isArray = Array.isArray(assertionItem)
      const assertion = isArray ? assertionItem[0] : assertionItem
      const value2 = isArray ? assertionItem[1] : undefined
      const key2 = isArray ? assertionItem[2] : undefined

      try {
        assertion?.(value, value2)
      } catch (error) {
        if (error instanceof Error) {
          return new ValidationError({
            key,
            value,
            key2,
            value2: value2?.toString(),
            code: assertion?.name,
            message: error.message,
          })
        }
      }
    }

    return undefined
  }
}

export function validateIf(
  cbOrBoolean: ((value: any) => boolean) | boolean,
  assertionItems: AssertionItem[],
): EmitAssertValidation {
  return function emitAssertValidation(value, key, isThrowError = true) {
    const cbResult = typeof cbOrBoolean === 'function' && cbOrBoolean(value)

    if (cbResult || cbOrBoolean === true) {
      return validate(assertionItems)(value, key, isThrowError)
    }
  }
}
