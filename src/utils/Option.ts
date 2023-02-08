export type Option<T> = T | undefined

export const mapOption = <T, U>(
  option: Option<T>,
  mapper: (t: T) => U
): Option<U> => {
  if (option === undefined) return undefined
  return mapper(option)
}
