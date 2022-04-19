import { and, matchPattern, notEmptyString, only, or, string, withValue, wrap, _undefined } from '../src'
import { handleErrorsIntoObject } from './helpers'

const wrap1 = wrap.bind({
  handleError: handleErrorsIntoObject,
})

export const validateCreateUserData = wrap1(
  only({
    username: withValue(/^(\w*)$/, matchPattern),
    password: and(string, notEmptyString),
    email: withValue(/@.*\.*./, matchPattern, 'email'),
    fullname: or(string, _undefined),
  }),
)
