import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '~/schemas/user'
import env from '~/config/env'

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET

export default function appPassport() {
  // passport local
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email }).exec()

          if (!user || !(await bcrypt.compare(password, user.password))) return done(null, false)

          return done(null, user)
        } catch (error) {
          return done(error)
        }
      },
    ),
  )

  // passport jwt
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: env.JWT_SECRET_ACCESS_TOKEN,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.sub).exec()

          if (!user) return done(null, false)

          return done(null, user)
        } catch (error) {
          return done(error)
        }
      },
    ),
  )

  // passport google
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value })

          if (!user) {
            user = await User.create({
              displayName: profile.displayName,
              email: profile.emails[0].value,
              email_verified: profile.emails[0].verified,
              avatar: profile.photos[0].value,
              provider: { strategy: profile.provider, id: profile.id },
            })
          }

          done(null, user)
        } catch (error) {
          return done(error)
        }
      },
    ),
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user ? user : false)
    } catch (error) {
      return done(error)
    }
  })
}
