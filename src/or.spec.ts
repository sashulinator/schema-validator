import { isPromise } from './is'
import { or } from './or'

describe(`${or.name}`, () => {
  it('Does not return error if not all fns returned error', async () => {
    const res = or(
      () => undefined,
      () => ({ message: 'test' }),
      () => undefined,
    )('testInput')

    expect(res).toEqual(undefined)
  })

  it('Does not return error if not all fns returned error with promise', async () => {
    const res = or(
      () => undefined,
      async () => ({ message: 'test' }),
      () => undefined,
    )('testInput')

    expect(isPromise(res)).toBeTruthy()
  })

  it('Returns first error', async () => {
    const res = or(
      () => ({ message: 'test' }),
      () => ({ message: 'test1' }),
      () => ({ message: 'test2' }),
    )('testInput')

    expect(res).toEqual({ message: 'test' })
  })

  it('Returns first not promise error if siblings are promise', async () => {
    const res = await or(
      () => ({ message: 'test' }),
      async () => ({ message: 'test1' }),
      () => ({ message: 'test2' }),
    )('testInput')

    expect(res).toEqual({ message: 'test' })
  })

  it('Returns first not promise error if siblings are not promise', async () => {
    const res = await or(
      async () => ({ message: 'test' }),
      () => ({ message: 'test1' }),
      () => ({ message: 'test2' }),
    )('testInput')

    expect(res).toEqual({ message: 'test1' })
  })
})
