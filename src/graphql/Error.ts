import { interfaceType, objectType } from 'nexus'

export const ErrorNexus = interfaceType({
  name: 'Error',
  definition(t) {
    t.nonNull.string('message')
  },
  resolveType(data) {
    if ('fields' in data) return 'ValidationError'
    if ('name' in data) return 'FieldError'

    throw new Error('Unresolved interface type!')
  }
})

export const FieldError = objectType({
  name: 'FieldError',
  definition(t) {
    t.implements(ErrorNexus)
    t.nonNull.string('name')
  }
})

export const ValidationError = objectType({
  name: 'ValidationError',
  definition(t) {
    t.implements(ErrorNexus)
    t.nonNull.list.nonNull.field('fields', { type: FieldError })
  }
})
