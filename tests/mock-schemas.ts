import {
  and,
  matchPattern,
  notEmptyString,
  only,
  or,
  string,
  withValue,
  wrap,
  _undefined,
  buildErrorTree,
} from '../src'

const wrap1 = wrap.bind({
  handleError: buildErrorTree,
}) as typeof wrap

export const validateCreateUserData = wrap1<{
  username: string
  password: string
  email: string
  fullname: string
  test: string
}>(
  only({
    username: withValue(/^(\w*)$/, matchPattern),
    password: and(string, notEmptyString),
    email: withValue(/@.*\.*./, matchPattern, 'email'),
    fullname: or(string, _undefined),
    test: string,
  }),
)
