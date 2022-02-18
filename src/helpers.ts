export function addPropertiesToFunction<
  Obj extends Record<string, unknown>,
  Func extends (...args: unknown[]) => unknown
>(obj: Obj, fn: Func): Func & Obj {
  Object.entries(obj).forEach(([key, value]) => {
    Object.defineProperty(fn, key, { value, writable: true, enumerable: true })
  })

  return fn as Func & Obj
}
