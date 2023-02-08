import { describe, expect, test } from '@jest/globals'
import { mapOption } from '../../src/utils/Option'

describe('Option utils', () => {
  describe('mapOption', () => {
    const mapper = (input: number): string => input.toString()

    test('returns mapped value if not undefined', () => {
      expect(mapOption(5, mapper)).toBe(mapper(5))
    })

    test('returns undefined otherwise', () => {
      expect(mapOption(undefined, mapper)).toBeUndefined()
    })
  })
})
