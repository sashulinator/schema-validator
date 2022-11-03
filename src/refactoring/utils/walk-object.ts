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
    for (let newKey of Object.keys(value)) {
      yield* walkObject(value[newKey], key, value, [...path, key], set)
    }
  }
}
