import { describe, expect, test } from '@jest/globals'
import { type TokenPayload, type TokenUtil } from '../src/auth/TokenUtil'
import { extractUserId } from '../src/context'
import { AuthService } from '../src/services/AuthService'
import { type Option } from '../src/utils/Option'
import { mockPasswordHashUtil, mockUserDao, stub } from './testUtils'

const tokenUtil: TokenUtil = {
  generate: stub,
  verify: async (token: string): Promise<Option<TokenPayload>> => {
    return { userId: token }
  }
}

const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
const authService = new AuthService(
  mockUserDao(),
  mockPasswordHashUtil(),
  tokenUtil
)

describe('context-related functions', () => {
  describe('extractUserId', () => {
    test('returns user id parsed from jwt in header string of format "Bearer <jwt>"', async () => {
      const result = await extractUserId(`Bearer ${jwt}`, authService)
      expect(result).toBe(jwt)
    })
  })
})
