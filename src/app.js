import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import appRoute from './routes'
import errorHandling from './middlewares/errorHandling'
import initPassport from './passport'
import ConnectMongo from './config/ConnectMongo'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())
app.use(morgan('dev'))
app.use(compression())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

// connect mongo
ConnectMongo.getInstance()

// passport
initPassport()

// routes
app.use('/', appRoute)

// handle error
app.use(errorHandling)

export default app
