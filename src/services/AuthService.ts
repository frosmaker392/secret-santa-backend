import { type UserDao, type UserForm } from '../daos/UserDao'
import { type PasswordHashUtil } from '../auth/PasswordHashUtil'
import { type TokenUtil } from '../auth/TokenUtil'
import { type NotUniqueError } from '../errors/NotUniqueError'
import { mapResult, type Result } from '../utils/Result'
import { mapOption, type Option } from '../utils/Option'
import { toUser } from '../adapters/User'
import { type PrismaUser, type User } from '../types/User'

export interface RegisterForm extends Omit<UserForm, 'passwordHash'> {
  password: string
}
export type RegisterResult = Result<User, NotUniqueError<PrismaUser>>

export interface LoginForm {
  usernameOrEmail: string
  password: string
}

export interface LoginPayload {
  token: string
  user: User
}

export class AuthService {
  constructor(
    private readonly userDao: UserDao,
    private readonly hashUtil: PasswordHashUtil,
    private readonly tokenUtil: TokenUtil
  ) {}

  register = async (registerForm: RegisterForm): Promise<RegisterResult> => {
    const passwordHash = await this.hashUtil.generate(registerForm.password)
    const { password: _, ...userDaoForm } = { ...registerForm, passwordHash }
    const createResult = await this.userDao.create(userDaoForm)

    return mapResult(createResult, prismaUser => toUser(prismaUser))
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
        user: toUser(user)
      }))
  }

  getUserId = async (token: string): Promise<Option<string>> => {
    const payloadOption = await this.tokenUtil.verify(token)
    return mapOption(payloadOption, payload => payload.userId)
  }
}
