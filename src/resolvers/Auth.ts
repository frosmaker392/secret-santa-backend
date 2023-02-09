import { type AuthService } from '../services/AuthService'
import {
  type GQLLoginForm,
  type GQLLoginResult,
  type GQLRegisterForm,
  type GQLRegisterResult
} from '../types/Auth'

export const register = async (
  form: GQLRegisterForm,
  authService: AuthService
): Promise<GQLRegisterResult> => {
  const result = await authService.register({
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
  authService: AuthService
): Promise<GQLLoginResult> => {
  return { ...(await authService.login(form)) }
}
