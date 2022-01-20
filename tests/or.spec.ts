import { primitive, required, or, ValidationError, assertString, assertStringifiedNumber } from '../src'
import expectMatchError from './expect-match-error'

describe(`${or.name}`, () => {
  it('"required" error', () => {
    const schema = or(
      required({
        user: {
          name: primitive(assertString),
        },
      }),
      required({
        user: {
          username: primitive(assertString),
        },
      }),
      required({
        user: {
          email: primitive(assertString),
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
          name: primitive(assertString),
        },
      },
      {
        user: {
          name: primitive(assertStringifiedNumber),
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
          name: primitive(assertString),
        },
      }),
      required({
        user: {
          username: primitive(assertString),
        },
      }),
      {
        user: {
          email: primitive(assertString),
        },
      },
    )

    expect(schema({ smthWrong: 'string' })).toBeUndefined()
  })
})
