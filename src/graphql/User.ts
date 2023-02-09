import { extendType, objectType } from 'nexus'
import { type Context } from '../context'
import { getUserById } from '../resolvers/User'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('username')
    t.nonNull.string('email')
    t.string('name')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
  }
})

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getCurrentUser', {
      type: 'User',
      resolve: async (_, __, context: Context) => {
        return (
          (await getUserById(context.services.user, context.userId)) ?? null
        )
      }
    })
  }
})
