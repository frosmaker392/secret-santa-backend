import { describe, expect, test } from '@jest/globals'
import { toUser } from '../../src/adapters/User'
import { type PrismaUser } from '../../src/types/User'
import { mockUser } from '../testUtils'

const user: PrismaUser = mockUser()

describe('User model', () => {
  describe('toUser', () => {
    test('returns user object without password hash', () => {
      const result = toUser(user)
      const { passwordHash: _, ...expected } = user
      expect(result).toEqual(expected)
    })
  })
})
