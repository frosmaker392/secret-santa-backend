import { describe, expect, test } from '@jest/globals'
import { toUser } from '../../src/adapters/User'
import { UserService } from '../../src/services/UserService'
import { mockUser, mockUserDao } from '../testUtils'

const user = toUser(mockUser())

const userDao = mockUserDao()
const userService = new UserService(userDao)

describe('UserService', () => {
  describe('getById', () => {
    test('returns user if found', async () => {
      const result = await userService.getById(user.id)
      expect(result).toEqual(user)
    })

    test('returns undefined otherwise', async () => {
      expect(await userService.getById('non-existent')).toBeUndefined()
    })
  })
})
