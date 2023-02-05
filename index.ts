import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { readFileSync } from 'fs'
import { type Resolvers } from './generated/graphql'
import dotenv from 'dotenv'

dotenv.config()

const typeDefs = readFileSync('./schema.graphql', 'utf-8')

const resolvers: Resolvers = {
  Query: {
    helloWorld: () => {
      return {
        id: 5,
        message: 'testing'
      }
    }
  }
}

const port = parseInt(process.env.PORT ?? '4000')

const server = new ApolloServer<any>({ typeDefs, resolvers })
const { url } = await startStandaloneServer(server, {
  listen: { port }
})

console.log(`Server ready at ${url}`)
