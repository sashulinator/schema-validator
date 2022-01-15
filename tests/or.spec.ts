import { assertString, assertStringifiedNumber } from '../src/assertions'
import { ValidationError } from '../src/errors'
import expectMatchError from '../src/expect-match-error'
import { or } from '../src/or'
import { required } from '../src/structure-validators'
import { validate } from '../src/validate'

describe(`${or.name}`, () => {
  it('"required" error', () => {
    const schema = or(
      required({
        user: {
          name: validate([assertString]),
        },
      }),
      required({
        user: {
          username: validate([assertString]),
        },
      }),
      required({
        user: {
          email: validate([assertString]),
        },
      }),
    )

    return expectMatchError(
      () =>
        schema({
          smthWrong: 'string',
        }),
      new ValidationError({
        key: 'test',
        value: ['user'],
        code: 'requiredKeys',
        message: 'some keys are required',
      }),
    )
  })

  it.only('"assertion" error', () => {
    const schema = or(
      {
        user: {
          name: validate([assertString]),
        },
      },
      {
        user: {
          name: validate([assertStringifiedNumber]),
        },
      },
    )

    return expectMatchError(
      () =>
        schema({
          user: { name: true },
        }),
      new ValidationError({
        key: 'test',
        value: ['user'],
        code: 'requiredKeys',
        message: 'some keys are required',
      }),
    )
  })

  it('pass', () => {
    const schema = or(
      required({
        user: {
          name: validate([assertString]),
        },
      }),
      required({
        user: {
          username: validate([assertString]),
        },
      }),
      {
        user: {
          email: validate([assertString]),
        },
      },
    )

    expect(schema({ smthWrong: 'string' })).toBeUndefined()
  })
})
