import { describe, test, expect } from '@jest/globals'
import { mapResult, resultError, resultOk } from '../../src/utils/Result'

const value = {
  id: 4,
  message: 'test'
}

const error = {
  message: 'error message'
}

describe('Result utils', () => {
  test('resultOk returns correctly', () => {
    expect(resultOk(value)).toEqual({
      ok: true,
      value
    })
  })

  test('resultError returns correctly', () => {
    expect(resultError(error)).toEqual({
      ok: false,
      error
    })
  })

  describe('mapResult', () => {
    const mapper = (from: string): number => from.length

    test('returns ok result with mapped value', () => {
      const value = 'test string'
      const inputResult = resultOk(value)

      expect(mapResult(inputResult, mapper)).toEqual({
        ok: true,
        value: mapper(value)
      })
    })

    test('returns same error result', () => {
      const inputResult = resultError(error)

      expect(mapResult(inputResult, mapper)).toEqual(inputResult)
    })
  })
})
