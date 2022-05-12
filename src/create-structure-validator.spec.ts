import { buildErrorTree, createStructureValidator, string, wrap } from '.'

const wrap1 = wrap.bind({
  handleError: buildErrorTree,
}) as typeof wrap

describe(`${createStructureValidator.name}`, () => {
  describe(`array`, () => {
    //
    const validator = wrap1([string])

    it('array', async () => {
      const error = validator('string')

      expect(error).toBeUndefined()
    })
  })
})
