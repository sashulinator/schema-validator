import { buildErrorTree, createStructureValidator, string, wrap } from '.'

const wrap1 = wrap.bind({
  handleError: buildErrorTree,
}) as typeof wrap

describe(`${createStructureValidator.name}`, () => {
  describe(`array`, () => {
    //
    const validator = wrap1([string])

    it('valid', async () => {
      const error = validator(['string'])

      expect(error).toBeUndefined()
    })

    it('invalid', async () => {
      const error = validator([1])

      expect(error).toEqual({ '0': { _code: 'assertString', _input: 1, _inputName: '0', _message: 'is not a string' } })
    })
  })
})
