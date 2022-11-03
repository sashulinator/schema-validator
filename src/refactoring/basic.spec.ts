import { string } from '..'
import { createSchemator } from './create-schemator'

const schemator = createSchemator()

const validate = schemator({
  hello: string,
})

describe('basic', () => {
  it('Returns error if any fn returned error', async () => {
    const scene = validate({ hello: 1 })

    console.log('scene', scene)
  })
})
