import {
  type UserCreateResult,
  type UserDao,
  type UserForm
} from '../daos/UserDao'
import { type PasswordHashUtil } from '../auth/PasswordHashUtil'
import { type Optional } from '../types'
import { type TokenUtil } from '../auth/TokenUtil'

export interface RegisterForm extends Omit<UserForm, 'passwordHash'> {
  password: string
}

export interface LoginForm {
  usernameOrEmail: string
  password: string
}

export interface LoginToken {
  token: string
}

export class UserService {
  constructor(
    private readonly userDao: UserDao,
    private readonly hashUtil: PasswordHashUtil,
    private readonly tokenUtil: TokenUtil
  ) {}

  register = async (userForm: RegisterForm): Promise<UserCreateResult> => {
    const passwordHash = await this.hashUtil.generate(userForm.password)
    const userDaoForm: UserForm = {
      ...userForm,
      passwordHash
    }
    return await this.userDao.create(userDaoForm)
  }

  login = async (loginForm: LoginForm): Promise<Optional<LoginToken>> => {
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

    return validPassword ? { token } : undefined
  }
}
