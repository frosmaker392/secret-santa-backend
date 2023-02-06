import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'
import { DateTimeResolver } from 'graphql-scalars'

import { type Resolvers } from './generated/graphql'

dotenv.config()

const typeDefs = readFileSync('./schema.graphql', 'utf-8')

const resolvers: Resolvers = {
  DateTime: DateTimeResolver,

  Query: {}
}

const port = parseInt(process.env.PORT ?? '4000')

const server = new ApolloServer<any>({ typeDefs, resolvers })
const { url } = await startStandaloneServer(server, {
  listen: { port }
})

console.log(`Server ready at ${url}`)
