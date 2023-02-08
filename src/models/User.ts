import { type User as PUser } from '@prisma/client'
import { type NexusGenObjects } from '../nexus-typegen'

export type User = Omit<PUser, 'passwordHash'>

type _tmp = NexusGenObjects['User']
export interface GQLUser extends _tmp {
  createdAt: Date
  updatedAt: Date
}

export const toUser = (prismaUser: PUser): User => {
  const { passwordHash: _, ...user } = prismaUser
  return user
}
