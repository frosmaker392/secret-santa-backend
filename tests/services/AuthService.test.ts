import { beforeEach, describe, expect, test } from '@jest/globals'
import { type User } from '@prisma/client'
import { type PasswordHashUtil } from '../../src/auth/PasswordHashUtil'
import { type TokenUtil } from '../../src/auth/TokenUtil'
import { type UserDao } from '../../src/daos/UserDao'
import { toUser } from '../../src/adapters/User'
import {
  type RegisterForm,
  AuthService,
  type LoginForm,
  type LoginPayload
} from '../../src/services/AuthService'
import {
  mockPasswordHashUtil,
  mockTokenUtil,
  mockUser,
  mockUserDao
} from '../testUtils'

const passwordHashUtil: PasswordHashUtil = mockPasswordHashUtil()
const tokenUtil: TokenUtil = mockTokenUtil()

const user: User = mockUser()
const userModel = toUser(user)

const registerForm: RegisterForm = {
  email: user.email,
  username: user.username,
  name: user.name,
  password: 'password'
}

const loginFormWithUsername: LoginForm = {
  usernameOrEmail: 'testUser',
  password: 'password'
}

const loginFormWithEmail: LoginForm = {
  usernameOrEmail: 'testUser@test.com',
  password: 'password'
}

const userDao: UserDao = mockUserDao()

let authService: AuthService

describe('AuthService', () => {
  beforeEach(() => {
    authService = new AuthService(userDao, passwordHashUtil, tokenUtil)
  })

  describe('register', () => {
    test('returns result with user on success with hashed password', async () => {
      const result = await authService.register(registerForm)

      expect(result.ok).toBeTruthy()

      const expected = {
        ok: true,
        value: userModel
      }

      expect(result).toEqual(expected)
    })

    test('returns result with error on failure', async () => {
      const result = await authService.register({
        ...registerForm,
        email: 'existingUser@test.com'
      })
      const expected = {
        ok: false,
        error: {
          fields: ['email']
        }
      }

      expect(result).toEqual(expected)
    })
  })

  describe('login', () => {
    const loginTest = async (form: LoginForm): Promise<void> => {
      const result = await authService.login(form)
      const expected: LoginPayload = {
        token: await tokenUtil.generate({ userId: user.id }),
        user: toUser(user)
      }

      expect(result).toEqual(expected)
    }

    describe('returns result with token on success', () => {
      test('with username', async () => {
        await loginTest(loginFormWithUsername)
      })

      test('with email', async () => {
        await loginTest(loginFormWithEmail)
      })
    })

    describe('returns undefined on failure', () => {
      test('wrong username/email', async () => {
        const result = await authService.login({
          usernameOrEmail: 'not-found',
          password: 'password'
        })
        expect(result).toBeUndefined()
      })

      test('wrong password', async () => {
        const result = await authService.login({
          usernameOrEmail: user.username,
          password: 'wrong-password'
        })
        expect(result).toBeUndefined()
      })
    })
  })

  describe('getUserId', () => {
    test('returns id from verified token', async () => {
      const token = await tokenUtil.generate({
        userId: user.id
      })
      const result = await authService.getUserId(token)

      expect(result).toBe(user.id)
    })

    test('returns undefined if token is invalid', async () => {
      const results = await Promise.all(
        ['', 'invalid-token'].map(authService.getUserId)
      )
      for (const result of results) {
        expect(result).toBeUndefined()
      }
    })
  })
})
