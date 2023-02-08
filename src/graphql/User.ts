import { objectType } from 'nexus'
import { DateTime } from './DateTime'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('username')
    t.nonNull.string('email')
    t.string('name')
    t.nonNull.field('createdAt', { type: DateTime })
    t.nonNull.field('updatedAt', { type: DateTime })
  }
})
