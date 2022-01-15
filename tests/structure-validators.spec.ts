/* eslint-disable jest/expect-expect */
import { assertString } from '../src/assertions'
import { ValidationError } from '../src/errors'
import expectMatchError from '../src/expect-match-error'
import { validate } from '../src/validate'
import { only, requiredOnly } from '../src/structure-validators'

describe(`${only.name}`, () => {
  it('nessted properties are reachable', () => {
    const schema = {
      user: {
        name: validate([assertString]),
      },
    }

    const onlySchema = only(schema)

    return expectMatchError(
      () => onlySchema.user.name(77),
      new ValidationError({
        key: 'test',
        value: 77,
        code: 'assertString',
        message: 'is not a string',
      }),
    )
  })
})

describe(`${requiredOnly.name}`, () => {
  it('nessted properties are reachable', () => {
    const schema = {
      user: {
        name: validate([assertString]),
      },
    }

    const onlySchema = requiredOnly(schema)

    return expectMatchError(
      () => onlySchema.user.name(77),
      new ValidationError({
        key: 'test',
        value: 77,
        code: 'assertString',
        message: 'is not a string',
      }),
    )
  })

  it.only('structure got passed as a third argument', () => {
    const schema = {
      user: {
        name: validate([
          assertString,
          (value: unknown, structure?: unknown) => {
            expect(structure).toEqual({ name: 'string', test: 77 })
          },
        ]),
      },
    }

    return only(schema)({
      user: {
        name: 'string',
        test: 77,
      },
    })
  })
})
