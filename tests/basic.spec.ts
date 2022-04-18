import { string, wrap } from '../src'
import { handleErrorsIntoObject } from './helpers'

const bindedWrap = wrap.bind({
  handleError: handleErrorsIntoObject,
})

describe('basic', () => {
  it('basic', () => {
    const validateSomeData = bindedWrap({
      test: string,
    })

    const errors = validateSomeData({
      test: 1,
    })

    console.log('errors', errors)
  })
})
