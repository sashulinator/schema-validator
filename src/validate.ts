import { ComparingAssertion } from '.'
import { ValidationError } from './errors'
import { Assertion, AssertionItem, EmitAssertValidation } from './types'

export function validate(...assertionItems: AssertionItem[]): EmitAssertValidation {
  return function emitAssertValidation(value, key, objStructure) {
    for (let index = 0; index < assertionItems.length; index += 1) {
      const assertionItem = assertionItems[index]
      let assertion: Assertion | ComparingAssertion
      let value2: unknown
      let key2: string

      try {
        if (Array.isArray(assertionItem)) {
          ;[assertion, value2, key2] = assertionItem
          // TODO test
          if (typeof value2 === 'function') {
            value2 = value2(value, key, objStructure)
          }
          assertion(value, value2, key, key2, objStructure)
        } else {
          assertion = assertionItem
          assertion(value, key, objStructure)
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
