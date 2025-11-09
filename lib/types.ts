export type OptionalArgFn<T, R> = T extends void ? () => R : (arg: T) => R
export type Simplify<T> = { [K in keyof T]: T[K] } & {}
