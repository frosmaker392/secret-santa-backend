import {
  arg,
  extendType,
  inputObjectType,
  nonNull,
  objectType,
  unionType
} from 'nexus'
import { type Context } from '../context'
import { login, register } from '../resolvers/Auth'

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

export const UserAlreadyExistsError = objectType({
  name: 'UserAlreadyExistsError',
  definition(t) {
    t.implements('Error')
    t.nonNull.list.nonNull.string('existsOnFields')
  }
})

export const LoginResult = objectType({
  name: 'LoginResult',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  }
})

export const RegisterPayload = objectType({
  name: 'RegisterPayload',
  definition(t) {
    t.nonNull.field('user', { type: 'User' })
  }
})

export const RegisterResult = unionType({
  name: 'RegisterResult',
  definition(t) {
    t.members('RegisterPayload', 'ValidationError', 'UserAlreadyExistsError')
  },
  resolveType(data) {
    if ('fields' in data) return 'ValidationError'
    if ('existsOnFields' in data) return 'UserAlreadyExistsError'
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
        form: arg({ type: nonNull('RegisterForm') })
      },
      resolve: async (_, { form }, context: Context) => {
        return await register(form, context.services.user)
      }
    })

    t.nonNull.field('login', {
      type: LoginResult,
      args: {
        form: arg({ type: nonNull('LoginForm') })
      },
      resolve: async (_, { form }, context) => {
        return await login(form, context.services.user)
      }
    })
  }
})
