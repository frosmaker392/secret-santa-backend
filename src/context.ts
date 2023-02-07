import { PrismaClient } from '@prisma/client'
import { BcryptHashUtil } from './auth/BcryptHashUtil'
import { JWTokenUtil } from './auth/JWTokenUtil'
import { UserPrismaDao } from './daos/UserPrismaDao'
import { UserService } from './services/UserService'

export interface Context {
  services: {
    user: UserService
  }
}

const prisma = new PrismaClient()
const userDao = new UserPrismaDao(prisma)

const hashUtil = new BcryptHashUtil()
const tokenUtil = new JWTokenUtil('secret')

const userService = new UserService(userDao, hashUtil, tokenUtil)

export const contextFunction = async (): Promise<Context> => ({
  services: {
    user: userService
  }
})
