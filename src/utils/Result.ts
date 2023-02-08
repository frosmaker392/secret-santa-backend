export interface Ok<T> {
  ok: true
  value: T
}
export interface Err<E> {
  ok: false
  error: E
}
export type Result<T, E> = Ok<T> | Err<E>

export const resultOk = <T>(value: T): Ok<T> => ({
  ok: true,
  value
})

export const resultError = <E>(error: E): Err<E> => ({
  ok: false,
  error
})

export const mapResult = <T, U, E>(
  result: Result<T, E>,
  mapper: (t: T) => U
): Result<U, E> => {
  if (result.ok)
    return {
      ok: true,
      value: mapper(result.value)
    }
  return result
}
