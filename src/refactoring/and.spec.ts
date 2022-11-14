import { assertPromise, string, _null } from '..'
import { validator } from './validator'
import { and } from './and'

describe('and', () => {
  describe('basic', () => {
    const schema = {
      hello: and(string, _null),
      world: string,
    }

    const promiseSchema = {
      world: async () => and(string, _null),
      hello: string,
    }

    it('Returns error', async () => {
      const error = validator(schema, { hello: 23, world: 34 })

      console.log('error', error)

      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'is not a string',
        code: 'assertString',
        input: 23,
        inputName: 'hello',
        path: ['hello'],
      })
      expect({ ...error[1], message: error[1].message }).toEqual({
        message: 'is not null',
        code: 'assertNull',
        input: 23,
        inputName: 'hello',
        path: ['hello'],
      })
    })

    it.only('Returns promise error', async () => {
      const promise = validator(promiseSchema, { hello: 33, world: 23 })
      console.log('errors', promise)
      assertPromise(promise)
      const errors = await promise

      expect({ ...errors[0], message: errors[0].message }).toEqual({
        message: 'is not a string',
        code: 'hello',
        input: 33,
        inputName: 'hello',
        path: ['hello'],
      })
      // expect({ ...errors[1], message: errors[1].message }).toEqual({
      //   message: 'is not null',
      //   code: 'assertNull',
      //   input: 23,
      //   inputName: 'hello',
      //   path: ['hello'],
      // })
    })
  })
})
