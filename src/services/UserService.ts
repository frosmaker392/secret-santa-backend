import { type User } from '@prisma/client'
import {
  type UserCreateResult,
  type UserDao,
  type UserForm
} from '../daos/UserDao'
import { type Optional } from '../types'

export interface RegisterForm extends Omit<UserForm, 'passwordHash'> {
  password: string
}

export interface LoginForm {
  usernameOrEmail: string
  password: string
}

type HashFunction = (password: string) => Promise<string>
type HashCompareFunction = (
  password: string,
  passwordHash: string
) => Promise<boolean>

export default class UserService {
  constructor(private readonly userDao: UserDao) {}

  register = async (
    userForm: RegisterForm,
    hashFunction: HashFunction
  ): Promise<UserCreateResult> => {
    const passwordHash = await hashFunction(userForm.password)
    const userDaoForm: UserForm = {
      ...userForm,
      passwordHash
    }
    return await this.userDao.create(userDaoForm)
  }

  login = async (
    loginForm: LoginForm,
    hashCompareFunction: HashCompareFunction
  ): Promise<Optional<User>> => {
    const { usernameOrEmail } = loginForm
    const [userByUsername, userByEmail] = await Promise.all([
      this.userDao.getByUsername(usernameOrEmail),
      this.userDao.getByEmail(usernameOrEmail)
    ])

    const user = userByUsername ?? userByEmail
    const validPassword = await hashCompareFunction(
      loginForm.password,
      user?.passwordHash ?? ''
    )

    return validPassword ? user : undefined
  }
}
