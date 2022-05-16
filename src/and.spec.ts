import { and } from './and'

describe(`${and.name}`, () => {
  it('Returns error if any fn returned error', async () => {
    const res = and(
      () => undefined,
      () => ({ message: 'test' }),
      () => undefined,
    )('testInput')

    expect(res).toEqual({ message: 'test' })
  })

  it('Returns error if async fn returned error', async () => {
    const res = await and(
      () => undefined,
      async () => ({ message: 'test' }),
      () => undefined,
    )('testInput')

    expect(res).toEqual({ message: 'test' })
  })

  it('Returns error if not async fn returned error', async () => {
    const res = and(
      () => undefined,
      () => ({ message: 'test' }),
      async () => undefined,
    )('testInput')

    expect(res).toEqual({ message: 'test' })
  })

  it('Returns first error if all fns returned error', async () => {
    const res = and(
      () => ({ message: 'test' }),
      () => ({ message: 'test1' }),
      () => ({ message: 'test2' }),
    )('testInput')

    expect(res).toEqual({ message: 'test' })
  })

  it('Returns first error if all fns returned promise error', async () => {
    const res = await and(
      async () => ({ message: 'test' }),
      () => ({ message: 'test1' }),
      () => ({ message: 'test2' }),
    )('inputTest')

    expect(res).toEqual({ message: 'test' })
  })
})
