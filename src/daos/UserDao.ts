import { type User } from '@prisma/client'
import { type NotUniqueError } from '../errors/NotUniqueError'
import { type Result, type Optional } from '../types'

export type UserForm = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UserCreateResult = Result<User, NotUniqueError<User>>

export interface UserDao {
  create: (userForm: UserForm) => Promise<UserCreateResult>
  getById: (id: string) => Promise<Optional<User>>
  getByEmail: (email: string) => Promise<Optional<User>>
  getByUsername: (username: string) => Promise<Optional<User>>
}
