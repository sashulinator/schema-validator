import { string, wrap } from '../src'
import { handleErrorsIntoObject } from './helpers'

const bindedWrap = wrap.bind({
  handleError: handleErrorsIntoObject,
})

describe('basic', () => {
  it('basic', () => {
    const validateSomeData = wrap({
      test: string,
    })

    const errors = validateSomeData.call(
      {
        handleError: handleErrorsIntoObject,
      },
      {
        test: 1,
      },
    )

    console.log('errors', errors)
  })
})
