import { describe, test, expect } from '@jest/globals'
import { resultError, resultOk } from '../../src/utils/Result'

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
})
