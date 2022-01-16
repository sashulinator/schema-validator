import { ValidationError } from './errors'
import { Assertion, AssertionItem, EmitAssertValidation } from './types'

export function validate(...assertionItems: AssertionItem[]): EmitAssertValidation {
  return function emitAssertValidation(value, key, structure) {
    for (let index = 0; index < assertionItems.length; index += 1) {
      const assertionItem = assertionItems[index]
      const isArray = Array.isArray(assertionItem)
      const assertion = isArray ? assertionItem[0] : assertionItem
      const value2 = isArray ? assertionItem[1] : undefined
      const key2 = isArray ? assertionItem[2] : undefined

      try {
        if (isArray) {
          assertion?.(value, value2, key, key2, structure)
        } else {
          ;(assertion as Assertion)?.(value, key, structure)
        }
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

export function validateIf(cbOrBoolean: ((value: any) => boolean) | boolean) {
  return (...assertionItems: AssertionItem[]): EmitAssertValidation => {
    return function emitAssertValidation(value, key, structure) {
      const cbResult = typeof cbOrBoolean === 'function' && cbOrBoolean(value)

      if (cbResult || cbOrBoolean === true) {
        return validate(...assertionItems)(value, key, structure)
      }
    }
  }
}
