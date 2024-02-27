import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { UserSchema } from '~/schemas/user'
import env from '~/config/env'

export default function appPassport() {
  // passport local
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await UserSchema.findOne({ email }).exec()

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
          const user = await UserSchema.findById(jwtPayload.sub).exec()

          if (!user) return done(null, false)

          return done(null, user)
        } catch (error) {
          return done(error)
        }
      },
    ),
  )

  // passport google
  // const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID
  // const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET

  // passport.use(
  //   new GoogleStrategy(
  //     {
  //       clientID: GOOGLE_CLIENT_ID,
  //       clientSecret: GOOGLE_CLIENT_SECRET,
  //       callbackURL: '/auth/google/callback',
  //       // scope: ['profile', 'email'],
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       try {
  //         let user = await UserSchema.findOne({ googleId: profile.id })

  //         // if (!user) user = await UserSchema.create(profile)

  //         done(null, user, { accessToken, refreshToken, profile })
  //       } catch (error) {
  //         return done(error)
  //       }
  //     },
  //   ),
  // )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserSchema.findById(id)
      done(null, user ? user : false)
    } catch (error) {
      return done(error)
    }
  })
}
