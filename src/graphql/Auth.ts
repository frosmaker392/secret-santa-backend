import {
  arg,
  extendType,
  inputObjectType,
  nonNull,
  objectType,
  unionType
} from 'nexus'
import { type Context } from '../context'
import { ValidationError } from './Error'
import { User } from './User'

export const RegisterForm = inputObjectType({
  name: 'RegisterForm',
  definition(t) {
    t.nonNull.string('username')
    t.nonNull.string('email')
    t.string('name')
    t.nonNull.string('password')
  }
})

export const LoginForm = inputObjectType({
  name: 'LoginForm',
  definition(t) {
    t.nonNull.string('usernameOrEmail')
    t.nonNull.string('password')
  }
})

export const UserAlreadyExists = objectType({
  name: 'UserAlreadyExists',
  definition(t) {
    t.nonNull.list.nonNull.string('existsOnFields')
  }
})

export const LoginResult = objectType({
  name: 'LoginResult',
  definition(t) {
    t.string('token')
    t.field('user', { type: User })
  }
})

export const RegisterPayload = objectType({
  name: 'RegisterPayload',
  definition(t) {
    t.nonNull.field('user', { type: User })
  }
})

export const RegisterResult = unionType({
  name: 'RegisterResult',
  definition(t) {
    t.members(RegisterPayload, ValidationError, UserAlreadyExists)
  },
  resolveType(data) {
    if ('message' in data) return 'ValidationError'
    if ('existsOnFields' in data) return 'UserAlreadyExists'
    if ('user' in data) return 'RegisterPayload'

    throw new Error('Unresolved union type!')
  }
})

export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('register', {
      type: RegisterResult,
      args: {
        form: arg({ type: nonNull(RegisterForm) })
      },
      resolve: async (_, { form }, context: Context) => {
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
            existsOnFields: result.error.fields
          }
        }
      }
    })

    t.nonNull.field('login', {
      type: LoginResult,
      args: {
        form: arg({ type: nonNull(LoginForm) })
      },
      resolve: async (_, { form }, context) => {
        const result = await context.services.user.login(form)
        if (result !== undefined) {
          return {
            token: result.token
          }
        }

        return {}
      }
    })
  }
})
