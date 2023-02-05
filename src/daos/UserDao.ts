import { type User } from '@prisma/client'
import { type Optional } from '../types'

export type UserForm = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

export default interface UserDao {
  create: (userForm: UserForm) => Promise<User>
  getById: (id: string) => Promise<Optional<User>>
  getByEmail: (email: string) => Promise<Optional<User>>
  getByUsername: (username: string) => Promise<Optional<User>>
}
