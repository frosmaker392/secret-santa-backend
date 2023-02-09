import { startStandaloneServer } from '@apollo/server/standalone'
import dotenv from 'dotenv'
import { createContextFunction } from './context'
import { server } from './server'

dotenv.config()

const port = parseInt(process.env.PORT ?? '4000')

startStandaloneServer(server, {
  context: createContextFunction(),
  listen: { port }
})
  .then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
  .catch(err => {
    console.error(err)
  })
