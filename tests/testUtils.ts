import { type PrismaUser } from '../src/types/User'
import { type PasswordHashUtil } from '../src/auth/PasswordHashUtil'
import { type TokenContents, type TokenUtil } from '../src/auth/TokenUtil'
import {
  type UserForm,
  type UserCreateResult,
  type UserDao
} from '../src/daos/UserDao'
import { type Option } from '../src/utils/Option'

export const stub = (): never => {
  throw new Error('Not implemented!')
}

export const mockHashGenerator = (password: string): string =>
  password.split('').reverse().join('')

export const mockPasswordHashUtil = (): PasswordHashUtil => ({
  generate: async (password: string): Promise<string> => {
    return mockHashGenerator(password)
  },
  compare: async (password: string, passwordHash: string): Promise<boolean> => {
    return mockHashGenerator(password) === passwordHash
  }
})

export const mockTokenUtil = (): TokenUtil => ({
  generate: async (contents: TokenContents): Promise<string> => {
    return contents.userId
  },
  verify: async (token: string): Promise<Option<TokenContents>> => {
    return { userId: token }
  }
})

export const mockUser = (): PrismaUser => ({
  id: 'test-id',
  username: 'testUser',
  email: 'testUser@test.com',
  name: 'Test User',
  passwordHash: mockHashGenerator('password'),
  createdAt: new Date(2022, 0, 1),
  updatedAt: new Date(2022, 0, 1)
})

export const mockUserDao = (): UserDao => ({
  create: async ({ email }: UserForm): Promise<UserCreateResult> => {
    if (email === mockUser().email)
      return {
        ok: true,
        value: mockUser()
      }
    return {
      ok: false,
      error: {
        fields: ['email']
      }
    }
  },
  getById: async (id: string): Promise<Option<PrismaUser>> => {
    const user = mockUser()
    if (id === user.id) return user
  },
  getByEmail: async (email: string): Promise<Option<PrismaUser>> => {
    const user = mockUser()
    if (email === user.email) return user
  },
  getByUsername: async (username: string): Promise<Option<PrismaUser>> => {
    const user = mockUser()
    if (username === user.username) return user
  }
})
