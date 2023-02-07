import { beforeEach, describe, expect, test } from '@jest/globals'
import { type User } from '@prisma/client'
import { type PasswordHashUtil } from '../../src/auth/PasswordHashUtil'
import { type TokenContents, type TokenUtil } from '../../src/auth/TokenUtil'
import {
  type UserCreateResult,
  type UserDao,
  type UserForm
} from '../../src/daos/UserDao'
import {
  type RegisterForm,
  UserService,
  type LoginForm,
  type LoginToken,
  type RegisterResult
} from '../../src/services/UserService'
import { type Ok, type Optional } from '../../src/types'

const stub = (): never => {
  throw new Error('Not implemented!')
}
const hashGen = (password: string): string =>
  password.split('').reverse().join('')

const passwordHashUtil: PasswordHashUtil = {
  generate: async (password: string): Promise<string> => {
    return hashGen(password)
  },
  compare: async (password: string, passwordHash: string): Promise<boolean> => {
    return password === hashGen(passwordHash)
  }
}

const tokenUtil: TokenUtil = {
  generate: async (contents: TokenContents): Promise<string> => {
    return contents.userId
  },
  verify: async (token: string): Promise<Optional<TokenContents>> => {
    return { userId: token }
  }
}

const user: User = {
  id: 'test-id',
  username: 'testUser',
  email: 'testUser@test.com',
  name: 'Test User',
  passwordHash: hashGen('password'),
  createdAt: new Date(2022, 0, 1),
  updatedAt: new Date(2022, 0, 1)
}

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

const registerUserDao: UserDao = {
  create: async (userForm: UserForm): Promise<UserCreateResult> => {
    return {
      ok: true,
      value: {
        ...user,
        ...userForm
      }
    }
  },
  getById: stub,
  getByEmail: stub,
  getByUsername: stub
}

const failingRegisterUserDao: UserDao = {
  create: async (): Promise<UserCreateResult> => {
    return {
      ok: false,
      error: {
        fields: ['email']
      }
    }
  },
  getById: stub,
  getByEmail: stub,
  getByUsername: stub
}

const loginUserDao: UserDao = {
  create: stub,
  getById: stub,
  getByUsername: async (username: string): Promise<Optional<User>> => {
    if (username === user.username) return user
    return undefined
  },
  getByEmail: async (email: string): Promise<Optional<User>> => {
    if (email === user.email) return user
    return undefined
  }
}

let userService: UserService

describe('UserService', () => {
  describe('register', () => {
    beforeEach(() => {
      userService = new UserService(
        registerUserDao,
        passwordHashUtil,
        tokenUtil
      )
    })

    test('returns result with user on success with hashed password', async () => {
      const result = await userService.register(registerForm)

      const expectedHash = await passwordHashUtil.generate('password')
      const createResult: RegisterResult = await registerUserDao.create({
        ...registerForm,
        passwordHash: expectedHash
      })

      expect(result.ok).toBeTruthy()

      const { passwordHash: _, ...user } = (createResult as Ok<User>).value
      const expected = {
        ok: true,
        value: user
      }

      expect(result).toEqual(expected)
    })

    test('returns result with error on failure', async () => {
      userService = new UserService(
        failingRegisterUserDao,
        passwordHashUtil,
        tokenUtil
      )

      const result = await userService.register(registerForm)
      const expected: UserCreateResult = await failingRegisterUserDao.create({
        ...registerForm,
        passwordHash: ''
      })

      expect(result).toEqual(expected)
    })
  })

  describe('login', () => {
    beforeEach(() => {
      userService = new UserService(loginUserDao, passwordHashUtil, tokenUtil)
    })

    const loginTest = async (form: LoginForm): Promise<void> => {
      const result = await userService.login(form)
      const expected: LoginToken = {
        token: await tokenUtil.generate({ userId: user.id })
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
        const result = await userService.login({
          usernameOrEmail: 'not-found',
          password: 'password'
        })
        expect(result).toBeUndefined()
      })

      test('wrong password', async () => {
        const result = await userService.login({
          usernameOrEmail: user.username,
          password: 'wrong-password'
        })
        expect(result).toBeUndefined()
      })
    })
  })
})
