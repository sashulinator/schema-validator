import { assertString, primitive } from '../../src/refactoring'

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
