import { string } from '..'
import { schemator } from './schemator'
import { validator } from './validator'

describe('validator', () => {
  describe('Primitives', () => {
    type Schema = {
      hello: string
      world: string
      sdsd: string
      test?: {
        au?: 'ua'
      }
    }
    const schema = schemator<Schema>({
      hello: string,
      world: string,
      sdsd: string,
      test: {
        au: string,
      },
    })

    it('Returns error', async () => {
      const error = schema.test.au(1)
      console.log('error', error)

      expect({ ...error[0], message: error[0].message }).toEqual({
        message: 'is not a string',
        code: 'assertString',
        input: 0,
        inputName: 'world',
        path: ['world'],
      })
    })

    // it('pass', async () => {
    //   const error = validator(schema, { hello: '1', world: '0' })
    //   expect(error).toEqual(undefined)
    // })
  })
})
