export interface Scene {
  path: string[]
  input: unknown
  assertion: Assertion
}

export type Assertion = (input: unknown, meta?: Scene) => void
