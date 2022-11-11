import { assertPromise, string } from '..'
import { validator } from './validator'

describe('validator', () => {
  describe('Primitives', () => {
    const schema = {
      hello: string,
      world: string,
    }

    const promiseSchema = {
      world: async (x: unknown) => string(x),
      hello: async (x: unknown) => string(x),
    }

    it('Returns error', async () => {
      const error = validator(schema, { hello: '1', world: 0 })
      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'is not a string',
        code: 'assertString',
        input: 0,
        inputName: 'world',
        path: ['world'],
      })
    })

    it('Returns promise error', async () => {
      const promise = validator(promiseSchema, { hello: '1', world: 0 })
      assertPromise(promise)
      const error = await promise
      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'is not a string',
        code: 'world',
        input: 0,
        inputName: 'world',
        path: ['world'],
      })
    })

    it('pass', async () => {
      const error = validator(schema, { hello: '1', world: '0' })
      expect(error).toEqual(undefined)
    })
  })

  describe('Object', () => {
    const schema = {
      hello: {
        world: string,
      },
    }

    const promiseSchema = {
      hello: {
        world: async (x: unknown) => string(x),
      },
    }

    it('Returns error', async () => {
      const error = validator(schema, { hello: { world: 1 } })
      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'is not a string',
        code: 'assertString',
        input: 1,
        inputName: 'world',
        path: ['hello', 'world'],
      })
    })

    it('Returns promise error', async () => {
      const promise = validator(promiseSchema, { hello: { world: 1 } })
      assertPromise(promise)
      const error = await promise
      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'is not a string',
        code: 'world',
        input: 1,
        inputName: 'world',
        path: ['hello', 'world'],
      })
    })

    it('Returns error 2', async () => {
      const error = validator(schema, { hello: 1 })
      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'is not an object',
        code: 'assertObject',
        input: 1,
        inputName: 'hello',
        path: ['hello'],
      })
    })
  })

  describe('Array', () => {
    const schema = {
      hello: [string],
    }

    it('Returns error', async () => {
      const error = validator(schema, { hello: ['0', 1] })

      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'is not a string',
        code: 'assertString',
        input: 1,
        inputName: 1,
        path: ['hello', 1],
      })
    })

    it('pass', async () => {
      const error = validator(schema, { hello: ['1'] })
      expect(error).toEqual(undefined)
    })
  })

  describe('primitive', () => {
    const schema = {
      hello: 'primitive',
    }

    it('Returns error', async () => {
      const error = validator(schema, { hello: 2 })

      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'not equal',
        code: 'assertEqual',
        input: 2,
        inputName: 'hello',
        path: ['hello'],
      })
    })

    it('pass', async () => {
      const error = validator(schema, { hello: 'primitive' })
      expect(error).toEqual(undefined)
    })
  })
})
