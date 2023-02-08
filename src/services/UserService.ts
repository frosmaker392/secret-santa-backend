import { type UserDao, type UserForm } from '../daos/UserDao'
import { type PasswordHashUtil } from '../auth/PasswordHashUtil'
import { type TokenUtil } from '../auth/TokenUtil'
import { type User } from '@prisma/client'
import { type NotUniqueError } from '../errors/NotUniqueError'
import { mapResult, type Result } from '../utils/Result'
import { mapOption, type Option } from '../utils/Option'

export interface RegisterForm extends Omit<UserForm, 'passwordHash'> {
  password: string
}

export type UserModel = Omit<User, 'passwordHash'>
export type RegisterResult = Result<UserModel, NotUniqueError<User>>

export interface LoginForm {
  usernameOrEmail: string
  password: string
}

export interface LoginPayload {
  token: string
  user: UserModel
}

export class UserService {
  constructor(
    private readonly userDao: UserDao,
    private readonly hashUtil: PasswordHashUtil,
    private readonly tokenUtil: TokenUtil
  ) {}

  register = async (userForm: RegisterForm): Promise<RegisterResult> => {
    const passwordHash = await this.hashUtil.generate(userForm.password)
    const { password: _, ...rest } = userForm
    const userDaoForm: UserForm = {
      ...rest,
      passwordHash
    }
    const createResult = await this.userDao.create(userDaoForm)

    return mapResult(createResult, user => {
      const { passwordHash: _, ...model } = user
      return model
    })
  }

  login = async (loginForm: LoginForm): Promise<Option<LoginPayload>> => {
    const { usernameOrEmail } = loginForm
    const [userByUsername, userByEmail] = await Promise.all([
      this.userDao.getByUsername(usernameOrEmail),
      this.userDao.getByEmail(usernameOrEmail)
    ])

    const user = userByUsername ?? userByEmail
    const validPassword = await this.hashUtil.compare(
      loginForm.password,
      user?.passwordHash ?? ''
    )

    const token = await this.tokenUtil.generate({
      userId: user?.id ?? ''
    })

    if (validPassword)
      return mapOption(user, user => ({
        token,
        user
      }))
  }
}
