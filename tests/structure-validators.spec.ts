/* eslint-disable jest/expect-expect */
import { assertString } from '../src/assertions'
import { ValidationError } from '../src/errors'
import expectMatchError from './expect-match-error'
import { primitive } from '../src/primitive'
import { notEmpty, only, requiredOnly } from '../src/structure-validators'

describe(`${only.name}`, () => {
  it('nessted properties are reachable', () => {
    const schema = {
      user: {
        name: primitive(assertString),
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
        name: primitive(assertString),
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

  it('structure got passed as a third argument', () => {
    const schema = {
      user: {
        name: primitive(assertString, (value: unknown, key: string, structure?: unknown) => {
          expect(structure).toEqual({ name: 'string', test: 77 })
        }),
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

describe(`${notEmpty.name}`, () => {
  it('no error', () => {
    const errorTree = notEmpty({
      user: {
        name: primitive(assertString),
      },
    })({
      user: {
        name: 'name',
      },
    })

    expect(errorTree).toBeUndefined()
  })

  it('error with object', () => {
    const errorTree = notEmpty({
      user: {
        name: primitive(assertString),
      },
    })({}, 'testObject')

    expect(errorTree).toMatchObject({
      _code: 'objectEmpty',
      _message: 'object cannot be empty',
      _key: 'testObject',
    })
  })

  it('error with array', () => {
    const errorTree = notEmpty([
      {
        name: primitive(assertString),
      },
    ])([], 'testArray')

    expect(errorTree).toMatchObject({
      _code: 'arrayEmpty',
      _message: 'array cannot be empty',
      _key: 'testArray',
    })
  })
})
