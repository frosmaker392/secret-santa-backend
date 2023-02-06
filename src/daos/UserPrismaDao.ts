import { PrismaDao } from './PrismaDao'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { resultError, resultOk } from '../utils/Result'
import { type User } from '@prisma/client'
import { type Optional } from '../types'
import { type UserForm, type UserDao, type UserCreateResult } from './UserDao'

export class UserPrismaDao extends PrismaDao implements UserDao {
  async create(userForm: UserForm): Promise<UserCreateResult> {
    try {
      const user = await this.prismaClient.user.create({
        data: {
          ...userForm,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      return resultOk(user)
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        const fields = (e.meta?.target as Array<keyof User>) ?? []
        return resultError({
          fields
        })
      }

      return resultError({
        fields: []
      })
    }
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
