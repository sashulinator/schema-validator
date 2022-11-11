export type DeepRequired<T> = Required<{ [P in keyof T]: DeepRequired<T[P]> }>

export interface Dictionary<A> {
  [index: string]: A
}

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export type DictionaryElement<T extends Dictionary<unknown>> = T extends { [k: string]: infer V } ? V : never

export type DeepPartial<T> = T extends Record<string, unknown>
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T
