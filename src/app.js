import express from 'express'
import appRoute from './routes'
import errorHandling from './middlewares/errorHandling'
import ConnectMongo from './config/ConnectMongo'
import appConfig from './config/appConfig'
import appPassport from './passport'

const app = express()

// app config
appConfig(app)

// connect mongo
ConnectMongo.getInstance()

// passport
appPassport()

// routes
app.use('/', appRoute)

// handle error
app.use(errorHandling)

export default app
