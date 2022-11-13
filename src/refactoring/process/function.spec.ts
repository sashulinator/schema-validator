import { assertPromise, string } from '../..'
import { ValidationError } from '../errors/validation'
import { createScene } from '../lib/create-scene'
import { Scene, Schema } from '../types'
import { processFunction } from './function'

describe('function', () => {
  describe('sync', () => {
    const commonScene = { path: [] as (string | number)[], schema: string, schemaItem: string, input: '1' }

    it('Returns error', async () => {
      const scene = createScene<ValidationError[], typeof string, typeof string>({ ...commonScene, input: 1 })
      const result = (await processFunction(scene)) as typeof scene
      expect(result.errorCollection.current?.[0]?.code).toEqual('assertString')
      expect(result.errorCollection.current?.[1]).toBeUndefined()
    })

    it('pass', async () => {
      const scene = createScene<ValidationError[], typeof string, typeof string>({ ...commonScene })
      const result = await processFunction(scene)
      expect(result.errorCollection.current).toBeUndefined()
    })

    const sceneToReturn = createScene<ValidationError[], typeof string, typeof string>({
      ...commonScene,
      input: '1',
    })
    const returnScene = (_: unknown, scene: Scene<unknown, Schema>) => {
      scene.errorCollection.current = [new ValidationError({ code: 'test', input: '1', message: 'test' })]
    }

    it('returns scene', async () => {
      const scene = createScene<ValidationError[], typeof string, typeof string>({
        ...sceneToReturn,
        input: 10,
        schema: returnScene,
        schemaItem: returnScene,
      })

      const result = await processFunction(scene)
      expect(sceneToReturn.errorCollection.current).toEqual([
        new ValidationError({ code: 'test', input: '1', message: 'test' }),
      ])
      expect(scene.errorCollection.current).toEqual([
        new ValidationError({ code: 'test', input: '1', message: 'test' }),
      ])
      expect(result.errorCollection.current).toEqual([
        new ValidationError({ code: 'test', input: '1', message: 'test' }),
      ])
      expect(sceneToReturn.input).toEqual('1')
    })
  })

  describe('async', () => {
    async function asyncAssertString(x: unknown) {
      string(x)
    }
    const commonScene = { path: [] as (string | number)[], schema: asyncAssertString, schemaItem: asyncAssertString }

    it('Returns error', async () => {
      const scene = createScene<ValidationError[], typeof string, typeof string>({ ...commonScene, input: 1 })
      const promise = processFunction(scene)
      assertPromise(promise)
      const result = (await promise) as typeof scene
      expect(result.errorCollection.current?.[0]?.code).toEqual('asyncAssertString')
      expect(result.errorCollection.current?.[1]).toBeUndefined()
    })

    it('pass', async () => {
      const scene = createScene<ValidationError[], typeof string, typeof string>({ ...commonScene, input: '1' })
      const promise = processFunction(scene)
      assertPromise(promise)
      const result = (await promise) as typeof scene
      expect(result.errorCollection.current).toBeUndefined()
    })

    it('returns scene', async () => {
      const common = { path: [] as (string | number)[], schema: asyncAssertString, schemaItem: asyncAssertString }

      const sceneToReturn = createScene<ValidationError[], typeof string, typeof string>({
        ...common,
        input: '1',
      })
      const returnScene = async (_: unknown, scene: Scene<unknown, Schema>) => {
        scene.errorCollection.current = [new ValidationError({ code: 'test', input: '1', message: 'test' })]
      }
      const scene = createScene<ValidationError[], typeof string, typeof string>({
        ...sceneToReturn,
        input: 10,
        schema: returnScene as any,
        schemaItem: returnScene as any,
      })

      const promise = processFunction(scene)

      assertPromise(promise)
      const result = await promise
      expect(sceneToReturn.errorCollection.current).toEqual([
        new ValidationError({ code: 'test', input: '1', message: 'test' }),
      ])
      expect(scene.errorCollection.current).toEqual([
        new ValidationError({ code: 'test', input: '1', message: 'test' }),
      ])
      expect(result.errorCollection.current).toEqual([
        new ValidationError({ code: 'test', input: '1', message: 'test' }),
      ])
      expect(sceneToReturn.input).toEqual('1')
    })
  })
})
