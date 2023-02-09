import { describe, expect, test } from '@jest/globals'
import { toUser } from '../../src/adapters/User'
import { login, register } from '../../src/resolvers/Auth'
import { UserService } from '../../src/services/UserService'
import {
  type GQLRegisterPayload,
  type GQLLoginForm,
  type GQLRegisterForm,
  type GQLUserAlreadyExistsError,
  type GQLLoginResult
} from '../../src/types/Auth'
import {
  mockPasswordHashUtil,
  mockTokenUtil,
  mockUser,
  mockUserDao
} from '../testUtils'

const user = mockUser()
const userModel = toUser(user)
const password = 'password'

const userService = new UserService(
  mockUserDao(),
  mockPasswordHashUtil(),
  mockTokenUtil()
)

const registerFormSuccess: GQLRegisterForm = {
  email: user.email,
  username: user.username,
  password
}

const registerFormFailure: GQLRegisterForm = {
  ...registerFormSuccess,
  email: 'existingUser@test.com'
}

const loginFormSuccess: GQLLoginForm = {
  usernameOrEmail: user.email,
  password
}

const loginFormFailure: GQLLoginForm = {
  usernameOrEmail: 'existingUser@test.com',
  password
}

describe('Resolvers for User', () => {
  describe('register', () => {
    test('returns RegisterPayload on success', async () => {
      const result = (await register(
        registerFormSuccess,
        userService
      )) as GQLRegisterPayload

      expect('user' in result).toBeTruthy()
      expect(result.user).toEqual(userModel)
    })

    test('returns UserAlreadyExists', async () => {
      const result = (await register(
        registerFormFailure,
        userService
      )) as GQLUserAlreadyExistsError

      expect(result.message).toBeDefined()
      expect(result.message.length).toBeGreaterThan(0)
      expect(result.existsOnFields).toEqual(['email'])
    })
  })

  describe('login', () => {
    test('returns LoginResult with user and token on success', async () => {
      const result = await login(loginFormSuccess, userService)

      const expected: GQLLoginResult = {
        user: userModel,
        token: user.id
      }

      expect(result).toEqual(expected)
    })

    test('returns empty object on failure', async () => {
      const result = await login(loginFormFailure, userService)

      expect(result).toEqual({})
    })
  })
})
