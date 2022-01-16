import { ComparingAssertion } from '.'

export function omitIfComparisonHasNoValue(comparingAssertion: ComparingAssertion): ComparingAssertion {
  const assertionWrapper: ComparingAssertion = (...args) => {
    if (args[1]) {
      return comparingAssertion(...args)
    }
  }

  return assertionWrapper
}
