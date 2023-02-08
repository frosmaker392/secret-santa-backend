import { type User } from '@prisma/client'
import { type NotUniqueError } from '../errors/NotUniqueError'
import { type Option } from '../utils/Option'
import { type Result } from '../utils/Result'

export type UserForm = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UserCreateResult = Result<User, NotUniqueError<User>>

export interface UserDao {
  create: (userForm: UserForm) => Promise<UserCreateResult>
  getById: (id: string) => Promise<Option<User>>
  getByEmail: (email: string) => Promise<Option<User>>
  getByUsername: (username: string) => Promise<Option<User>>
}
