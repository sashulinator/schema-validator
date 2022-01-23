import { assertString, primitive, assertMatchPattern, withRef, assertRegExp } from '../../src/refactoring'

export const credentialsSchema = {
  username: primitive(assertString),
  password: primitive(assertString),
}

export const invalidCredentials = {
  username: 1223,
  password: 134234,
}

export const validCredentials = {
  username: 'username',
  password: 'password',
}

export const basicBlockSchema = {
  pattern: primitive(assertRegExp),
  defaultValue: primitive(withRef('pattern', assertMatchPattern)),
}

export const invalidBlock = {
  pattern: /^test$/,
  defaultValue: 'notvalid',
}
