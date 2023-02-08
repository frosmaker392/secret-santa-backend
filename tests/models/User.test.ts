import { describe, expect, test } from '@jest/globals'
import { toUser } from '../../src/models/User'
import { type User as PUser } from '@prisma/client'

const user: PUser = {
  id: 'test-id',
  username: 'testUser',
  email: 'testUser@test.com',
  name: 'Test User',
  passwordHash: 'test-pass-hash',
  createdAt: new Date(2022, 1, 1),
  updatedAt: new Date(2022, 1, 1)
}

describe('User model', () => {
  describe('toUser', () => {
    test('returns user object without password hash', () => {
      const result = toUser(user)
      const { passwordHash: _, ...expected } = user
      expect(result).toEqual(expected)
    })
  })
})
