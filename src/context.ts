import { type ContextFunction } from '@apollo/server'
import { type StandaloneServerContextFunctionArgument } from '@apollo/server/dist/esm/standalone'
import { PrismaClient } from '@prisma/client'
import { BcryptHashUtil } from './auth/BcryptHashUtil'
import { JWTokenUtil } from './auth/JWTokenUtil'
import { UserPrismaDao } from './daos/UserPrismaDao'
import { AuthService } from './services/AuthService'
import { UserService } from './services/UserService'
import { mapOption, type Option } from './utils/Option'

export interface Context {
  userId?: string
  services: {
    auth: AuthService
    user: UserService
  }
}

const prisma = new PrismaClient()
const userDao = new UserPrismaDao(prisma)

const hashUtil = new BcryptHashUtil()
const tokenUtil = new JWTokenUtil('secret')

const authService = new AuthService(userDao, hashUtil, tokenUtil)
const userService = new UserService(userDao)

const extractJWToken = (authHeader: Option<string>): Option<string> => {
  return mapOption(authHeader, header => {
    const matches = header.match(
      /^Bearer ([A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*)$/
    )
    return matches?.[1]
  })
}

export const extractUserId = async (
  authHeader: Option<string>,
  authService: AuthService
): Promise<Option<string>> => {
  const token = extractJWToken(authHeader)
  return await mapOption(
    token,
    async token => await authService.getUserId(token)
  )
}

export const contextFunction: ContextFunction<
  [StandaloneServerContextFunctionArgument],
  Context
> = async ({ req }): Promise<Context> => ({
  userId: await extractUserId(req.headers.authorization, authService),
  services: {
    auth: authService,
    user: userService
  }
})
