/* eslint-disable jest/expect-expect */
import {
  assertBoolean,
  assertMatchPattern,
  assertRegExp,
  assertString,
  assertStringifiedNumber,
} from '../src/assertions'
import { ValidationError } from '../src/errors'
import expectMatchError from './expect-match-error'
import { validate, validateIf } from '../src/validate'
import { only, requiredOnly } from '../src/structure-validators'
import { isNotEmptyString } from '../src/is'

describe(`${only.name}`, () => {
  it('nessted properties are reachable', () => {
    const schema = {
      user: {
        name: validate(assertString),
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
        name: validate(assertString),
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
        name: validate(assertString, (value: unknown, key: string, structure?: unknown) => {
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

  it('no excessive keys in ErrorTree', () => {
    const errorTree = only({
      user: {
        name: validateIf(true)(assertString),
        test: validateIf(true)(assertString),
      },
    })({
      user: {
        name: true,
        test: '77',
      },
    })

    // @ts-ignore
    expect(errorTree.test).toBeUndefined()
  })

  it('ErrorTree = undefined', () => {
    const errorTree = only({
      user: {
        name: validateIf(true)(assertString),
        test: validateIf(true)(assertString),
      },
    })({
      user: {
        name: 'name',
        test: 'test',
      },
    })

    // @ts-ignore
    expect(errorTree).toBeUndefined()
  })

  it('array in schema', () => {
    type Text = {
      defaultValue: string
      pattern: string
      hints: string[]
    }

    function assertMatchPatternFromStructure(v: unknown, key?: string, obj?: Text) {
      expect(obj).toMatchObject({
        defaultValue: 'testDefaultValue',
        pattern: 'test',
        hints: ['test'],
      })

      if (obj?.pattern) {
        assertMatchPattern(v, obj.pattern)
      }
    }

    const textSchema = {
      testNesting: {
        anotherOne: {
          defaultValue: validateIf(isNotEmptyString)(assertMatchPatternFromStructure),
          pattern: validateIf(isNotEmptyString)(assertRegExp),
          hints: [validateIf(isNotEmptyString)(assertMatchPatternFromStructure)],
        },
      },
    }

    const errorTree = only(textSchema)({
      testNesting: {
        anotherOne: {
          defaultValue: 'testDefaultValue',
          pattern: 'test',
          hints: ['test'],
        },
      },
    })

    expect(errorTree).toBeUndefined()
  })
})
