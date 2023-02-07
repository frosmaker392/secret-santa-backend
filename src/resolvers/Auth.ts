import {
  type RegisterForm,
  type RegisterResult,
  type LoginForm,
  type LoginResult
} from '../../generated/graphql'
import { type Context } from '../context'

interface RegisterArgs {
  form: RegisterForm
}

interface LoginArgs {
  form: LoginForm
}

const register = async (
  _: unknown,
  { form }: RegisterArgs,
  context: Context
): Promise<RegisterResult> => {
  const result = await context.services.user.register({
    ...form,
    name: form.name ?? null
  })

  if (result.ok) {
    const user = result.value
    return {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }
    }
  } else {
    return {
      message: 'User already exists!',
      fields: result.error.fields.map(field => ({
        name: field,
        message: `User already exists with given ${field}`
      }))
    }
  }
}

const login = async (
  _: unknown,
  { form }: LoginArgs,
  context: Context
): Promise<LoginResult> => {
  const result = await context.services.user.login(form)
  if (result !== undefined) {
    return {
      token: result.token
    }
  }

  return {}
}

export default {
  register,
  login
}
