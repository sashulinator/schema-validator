import { string, only, required, _undefined } from '../src'
import { handleErrorsIntoObject } from './helpers'

const bindedOnly = only.bind({ handleError: handleErrorsIntoObject })
const bindedRequired = required.bind({ handleError: handleErrorsIntoObject })

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

  it('required', () => {
    const validateSomeData = bindedRequired({
      requiredTest: _undefined,
    })

    const errors = validateSomeData.call(
      {
        handleError: handleErrorsIntoObject,
      },
      {
        test: undefined,
      },
    )

    console.log('errors', errors)
  })
})
