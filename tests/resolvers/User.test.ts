import { describe, expect, test } from '@jest/globals'
import { toUser } from '../../src/adapters/User'
import { getUserById } from '../../src/resolvers/User'
import { UserService } from '../../src/services/UserService'
import { mockUser, mockUserDao } from '../testUtils'

const user = toUser(mockUser())
const userDao = mockUserDao()
const userService = new UserService(userDao)

describe('User resolvers', () => {
  describe('getUserById', () => {
    test('returns user if found', async () => {
      const result = await getUserById(userService, user.id)
      expect(result).toEqual(user)
    })

    test('returns undefined otherwise', async () => {
      expect(await getUserById(userService, 'non-existent')).toBeUndefined()
    })
  })
})
