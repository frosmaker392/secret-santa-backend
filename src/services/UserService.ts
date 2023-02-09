import { toUser } from '../adapters/User'
import { type UserDao } from '../daos/UserDao'
import { type User } from '../types/User'
import { mapOption, type Option } from '../utils/Option'

export class UserService {
  constructor(private readonly userDao: UserDao) {}

  getById = async (id: string): Promise<Option<User>> => {
    const prismaUserOption = await this.userDao.getById(id)
    return mapOption(prismaUserOption, toUser)
  }
}
