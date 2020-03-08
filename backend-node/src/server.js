import express from 'express'
import graphqlHTTP from 'express-graphql'
import cors from 'cors'
import bodyParser from 'body-parser';

import schema from './schema'

const APP_PORT = 5000

const app = new express()

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

app.use(graphqlHTTP({
    graphiql: true,
    schema,
    pretty: true
}))

try{
    app.listen(APP_PORT, () => console.log((`GraphQL server running at ${APP_PORT}`)))
} catch (error) {
    console.log(`Something went wrong ${error}`)
}
