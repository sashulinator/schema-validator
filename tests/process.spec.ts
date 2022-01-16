/* eslint-disable jest/expect-expect */
import { assertString } from '../src/assertions'
import { process } from '../src/process'
import { ValidationError } from '../src/errors'
import expectMatchError from './expect-match-error'
import { validate } from '../src/validate'

describe(`${process.name}`, () => {
  it('return errorTree', () => {
    const schema = {
      user: {
        username: validate(assertString),
      },
    }

    const { errorTree } = process(schema, { user: { username: 77 } })

    return expectMatchError(() => errorTree, {
      user: {
        username: new ValidationError({
          key: 'username',
          value: 77,
          code: 'assertString',
          message: 'is not a string',
        }),
      },
    })
  })

  it('return errorTree for an array', () => {
    const schema = {
      users: [
        {
          username: validate(assertString),
        },
      ],
    }

    const { errorTree } = process(schema, { users: [{ username: 77 }] })

    return expectMatchError(() => errorTree, {
      users: {
        '0': {
          username: new ValidationError({
            key: 'username',
            value: 77,
            code: 'assertString',
            message: 'is not a string',
          }),
        },
      },
    })
  })
})
