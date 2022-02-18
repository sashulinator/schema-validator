export function errorToObject<T extends Record<string, any>>(error: T): T {
  return { ...error }
}
