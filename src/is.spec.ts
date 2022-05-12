import { isEmpty } from './is'

describe(`is`, () => {
  describe(`isEmpty`, () => {
    it('true', async () => {
      const res = isEmpty({})
      const res1 = isEmpty([])
      const res2 = isEmpty('')

      expect(res).toBeTruthy()
      expect(res1).toBeTruthy()
      expect(res2).toBeTruthy()
    })

    it('false', async () => {
      const res = isEmpty({ t: 't' })
      const res1 = isEmpty(['t'])
      const res2 = isEmpty('t')

      expect(res).toBeFalsy()
      expect(res1).toBeFalsy()
      expect(res2).toBeFalsy()
    })
  })
})
