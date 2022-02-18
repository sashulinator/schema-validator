import { assertNumber, assertString } from '../src'
import { ssv2 } from './schemas'

describe('with', () => {
  it('withRef basic', () => {
    const validateTest = ssv2.or(
      {
        latitude: assertString,
      },
      {
        latitude: assertNumber,
      },
    )

    const errors = validateTest({
      latitude: /dsd/,
    })

    expect(errors).toStrictEqual({
      latitude: {
        _code: 'assertString',
        _input: '/dsd/',
        _inputName: 'latitude',
        _message: 'is not a string',
      },
    })
  })
})
