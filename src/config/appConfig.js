import compression from 'compression'
import cookieParser from 'cookie-parser'
import express, { Express } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import env from './env'
import path from 'path'
import ms from 'ms'

const SESSION_COOKIE_EXPIRESIN = ms(env.SESSION_COOKIE_EXPIRESIN)

/**
 * @param {Express} app Express
 */
function appConfig(app) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(helmet())
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        imgSrc: ["'self'", 'data:', 'https://tailwindui.com'],
      },
    }),
  )
  app.use(morgan('dev'))
  app.use(compression())
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  )

  // if (env.NODE_ENV === 'production') {
  //   app.set('trust proxy', 1)
  //   session.cookie.secure = true
  // }

  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: env.MONGO_CONNECT_STRING }),
      cookie: {
        maxAge: SESSION_COOKIE_EXPIRESIN, // thời gian tính bằng mini giây
      },
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())

  app.use('/public', express.static(path.join(process.cwd(), 'public')))
  app.set('views', path.join(process.cwd(), 'src/views'))
  app.set('view engine', 'ejs')
}

export default appConfig
