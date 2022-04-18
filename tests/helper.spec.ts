import { string, wrap, only } from '../src'
import { handleErrorsIntoObject } from './helpers'

const bindedOnly = only.bind({ handleError: handleErrorsIntoObject })

describe('basic', () => {
  it('only', () => {
    const validateSomeData = bindedOnly({
      test: string,
    })

    const errors = validateSomeData.call(
      {
        handleError: handleErrorsIntoObject,
      },
      {
        test: 1,
        excessiveTestKey: 1,
      },
    )

    console.log('errors', errors)
  })
})
