import { type UserService } from '../services/UserService'
import {
  type GQLLoginForm,
  type GQLLoginResult,
  type GQLRegisterForm,
  type GQLRegisterResult
} from '../types/Auth'

export const register = async (
  form: GQLRegisterForm,
  userService: UserService
): Promise<GQLRegisterResult> => {
  const result = await userService.register({
    ...form,
    name: form.name ?? null
  })

  if (result.ok) return { user: result.value }

  return {
    message: 'User already exists!',
    existsOnFields: result.error.fields
  }
}

export const login = async (
  form: GQLLoginForm,
  userService: UserService
): Promise<GQLLoginResult> => {
  return { ...(await userService.login(form)) }
}
