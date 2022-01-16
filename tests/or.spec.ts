import { validate, required, or, ValidationError, assertString, assertStringifiedNumber } from '../src'
import expectMatchError from './expect-match-error'

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

  it('"assertion" error', () => {
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
      {
        user: {
          name: new ValidationError({
            key: 'name',
            value: true,
            code: 'assertStringifiedNumber',
            message: 'is not a stringified number',
          }),
        },
      },
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
