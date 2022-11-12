import { assertPromise, number, string } from '..'
import { validator } from './validator'
import { or } from './or'

describe('or', () => {
  describe('basic', () => {
    const schema = {
      hello: or(string, number),
      world: string,
    }

    const promiseSchema = {
      world: (x: unknown) => or(string, number)(x),
      hello: async (x: unknown) => string(x),
    }

    it('Returns error', async () => {
      const error = validator(schema, { hello: [], world: 0 })
      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'is not a string',
        code: 'assertString',
        input: [],
        inputName: 'hello',
        path: ['hello'],
      })
    })

    it('Returns promise error', async () => {
      const promise = validator(promiseSchema, { hello: [], world: 0 })
      assertPromise(promise)
      const error = await promise
      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'is not a string',
        code: 'hello',
        input: [],
        inputName: 'hello',
        path: ['hello'],
      })
    })

    it('primitive number valid', async () => {
      const error = validator(or('string', 23), 23)
      expect(error).toEqual(undefined)
    })

    it('primitive string valid', async () => {
      const error = validator(or('string', 23), 'string')
      expect(error).toEqual(undefined)
    })

    it('primitive string array valid', async () => {
      const error = validator(or(['string'], [23]), ['string'])
      expect(error).toEqual(undefined)
    })

    it('primitive string array error', async () => {
      const error = validator(or(['string'], [23]), ['oops'])
      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'not equal',
        code: 'assertEqual',
        input: 'oops',
        inputName: 0,
        path: [0],
        relative: 'string',
        relativeName: 'comparing value',
      })
    })
  })
})
