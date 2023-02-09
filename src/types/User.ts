import { type User as PUser } from '@prisma/client'
import { type NexusGenObjects } from '../nexus-typegen'
import { type Replace } from './utils'

export type PrismaUser = PUser

export type User = Omit<PUser, 'passwordHash'>

export type GQLUser = Replace<
  NexusGenObjects['User'],
  'createdAt' | 'updatedAt',
  Date
>
