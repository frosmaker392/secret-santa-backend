import { type PrismaUser, type User } from '../types/User'

export const toUser = (prismaUser: PrismaUser): User => {
  const { passwordHash: _, ...user } = prismaUser
  return user
}
