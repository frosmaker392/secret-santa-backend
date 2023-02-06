import { type User } from '@prisma/client'
import { type Optional } from '../types'
import PrismaDao from './PrismaDao'
import { type UserForm } from './UserDao'
import type UserDao from './UserDao'

export default class UserPrismaDao extends PrismaDao implements UserDao {
  async create(userForm: UserForm): Promise<User> {
    return await this.prismaClient.user.create({
      data: userForm
    })
  }

  async getById(id: string): Promise<Optional<User>> {
    return await this.defaultToUndefined(
      this.prismaClient.user.findUnique({
        where: { id }
      })
    )
  }

  async getByEmail(email: string): Promise<Optional<User>> {
    return await this.defaultToUndefined(
      this.prismaClient.user.findUnique({
        where: { email }
      })
    )
  }

  async getByUsername(username: string): Promise<Optional<User>> {
    return await this.defaultToUndefined(
      this.prismaClient.user.findUnique({
        where: { username }
      })
    )
  }
}
