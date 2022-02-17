export const createErrorTree = (obj: Record<string, unknown>, pathString: string, value: any = null) => {
  let paths = pathString.split('.')
  let current = obj
  while (paths.length > 1) {
    const [head, ...tail] = paths
    paths = tail
    if (current[head] === undefined) {
      current[head] = {}
    }
    current = current[head] as Record<string, unknown>
  }
  if (value) {
    const oldValue = current[paths[0]] as any
    current[paths[0]] = { ...oldValue, ...value }
  }
  return obj
}
