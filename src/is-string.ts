export function isString(input: unknown): input is string {
  if (typeof input === 'string' || input instanceof String) {
    return true
  }
  return false
}
