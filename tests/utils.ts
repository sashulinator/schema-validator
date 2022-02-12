export function errorToObject<T extends Record<string, unknown>>(error: T): T {
  return { ...error }
}
