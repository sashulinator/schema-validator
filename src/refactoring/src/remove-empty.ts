import { ErrorTree } from './types'

export const removeEmpty = (obj: ErrorTree) => {
  if (obj === undefined) {
    return undefined
  }

  const newObj = {}
  Object.keys(obj).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key])
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    else if (obj[key] !== undefined) newObj[key] = obj[key]
  })
  return Object.keys(newObj).length > 0 ? newObj : undefined
}
