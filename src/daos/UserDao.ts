import { type PrismaUser } from '../types/User'
import { type NotUniqueError } from '../errors/NotUniqueError'
import { type Option } from '../utils/Option'
import { type Result } from '../utils/Result'

export type UserForm = Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt'>
export type UserCreateResult = Result<PrismaUser, NotUniqueError<PrismaUser>>

export interface UserDao {
  create: (userForm: UserForm) => Promise<UserCreateResult>
  getById: (id: string) => Promise<Option<PrismaUser>>
  getByEmail: (email: string) => Promise<Option<PrismaUser>>
  getByUsername: (username: string) => Promise<Option<PrismaUser>>
}
