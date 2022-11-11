import { isObject } from '../../is'
import { Key } from '../../types'
import { Dictionary } from './types'

type Callback = (key: Key, value: unknown, path: string[], i: number, data: Dictionary<unknown>) => boolean | void

export function walk<T>(obj: Dictionary<T>, cb: Callback, path: string[] = [], origObj?: Dictionary<T>) {
  const entries = Object.entries(obj)

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i] as [string, unknown]
    const newPath = [...path, key]

    if (cb(key, value, newPath, i, origObj || obj)) {
      break
    }

    if (isObject(value)) {
      walk(value, cb, newPath, origObj)
    }
  }
}
