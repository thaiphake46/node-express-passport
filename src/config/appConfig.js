import compression from 'compression'
import cookieParser from 'cookie-parser'
import express, { Express } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import passport from 'passport'
import session from 'express-session'
import env from './env'

/**
 * @param {Express} app Express
 */
export default function appConfig(app) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(helmet())
  app.use(morgan('dev'))
  app.use(compression())
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        // name: 'session',
        // keys: ['NucMD'],
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
}