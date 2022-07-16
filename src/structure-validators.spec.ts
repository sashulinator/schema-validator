import { buildErrorArray, buildErrorTree, string, _undefined } from '.'
import { only, wrap } from './structure-validators'

const onlyBind = only.bind({
  handleError: buildErrorTree,
})

const wrapBindArr = wrap.bind({
  handleError: buildErrorArray,
})

describe(`${only.name}`, () => {
  const nestedData = onlyBind({
    test: only({
      test1: _undefined,
    }),
  })

  it('invalid', async () => {
    const error = nestedData({ test: { test } })

    expect(error).toEqual({
      test: {
        _code: 'excessiveKeys',
        _message: 'some keys are excessive',
        _inputName: 'test',
        _input: ['test'],
        _path: 'test',
      },
    })
  })
})
