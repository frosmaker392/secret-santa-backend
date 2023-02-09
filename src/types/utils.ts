export type Replace<T, K extends keyof T, R> = Omit<T, K> & {
  [P in K]: R
}

export type ReplaceOptional<T, K extends keyof T, R> = Omit<T, K> & {
  [P in K]?: R
}
