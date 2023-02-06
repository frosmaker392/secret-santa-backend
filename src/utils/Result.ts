import { type Err, type Ok } from '../types'

export const resultOk = <T>(value: T): Ok<T> => ({
  ok: true,
  value
})

export const resultError = <E>(error: E): Err<E> => ({
  ok: false,
  error
})
