import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'
import { DateTimeResolver } from 'graphql-scalars'

import type {
  RegisterPayload,
  Resolvers,
  UserAlreadyExists,
  ValidationError
} from '../generated/graphql'
import { contextFunction, type Context } from './context'
import Auth from './resolvers/Auth'

dotenv.config()

const typeDefs = readFileSync('./schema.graphql', 'utf-8')

const resolvers: Resolvers = {
  DateTime: DateTimeResolver,

  RegisterResult: {
    __resolveType(obj) {
      if ((obj as RegisterPayload).user !== undefined) return 'RegisterPayload'
      if ((obj as ValidationError).fields !== undefined)
        return 'ValidationError'
      if ((obj as UserAlreadyExists).existsOnFields !== undefined)
        return 'UserAlreadyExists'

      return null
    }
  },

  Query: {
    hello: () => {
      return 'worl'
    }
  },

  Mutation: {
    ...Auth
  }
}

const port = parseInt(process.env.PORT ?? '4000')

const server = new ApolloServer<Context>({ typeDefs, resolvers })

startStandaloneServer(server, {
  context: contextFunction,
  listen: { port }
})
  .then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
  .catch(err => {
    console.error(err)
  })
