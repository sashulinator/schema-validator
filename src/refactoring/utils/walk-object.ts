import { isObject } from '../..'

export function* walkObject<T>(
  value: Record<string, T> | T,
  key?: string,
  object?: Record<string, T>,
  path: string[] = [],
  set = new Set(),
): Generator<{ key: string; path: string[]; value: Record<string, T> | T; object: Record<string, T> }> {
  yield { value, key, path, object }

  if (isObject(value) && !set.has(value)) {
    set.add(value)
    // eslint-disable-next-line prefer-const, no-restricted-syntax
    const keys = Object.keys(value)
    for (let index = 0; index < keys.length; index += 1) {
      const newKey = keys[index]
      yield* walkObject(value[newKey], newKey, value, [...path, key], set)
    }
  }
}
