import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { UserSchema } from '~/schemas/user'

const initPassport = () => {
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

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET_ACCESS_TOKEN,
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

  // const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  // const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

  // passport.use(
  //   new GoogleStrategy(
  //     {
  //       clientID: GOOGLE_CLIENT_ID,
  //       clientSecret: GOOGLE_CLIENT_SECRET,
  //       callbackURL: 'http://localhost',
  //       scope: ['profile'],
  //     },
  //     async (accessToken, refreshToken, profile, cb) => {
  //       try {
  //         let user = await User.findOne({ googleId: profile.id })

  //         console.log('passport google oauth ::', accessToken)
  //         console.log('passport google oauth ::', refreshToken)
  //         console.log('passport google oauth ::', profile)
  //         console.log('passport google oauth ::', user)

  //         if (!user) user = await User.create(profile)

  //         cb(null, user)
  //       } catch (error) {
  //         return cb(error)
  //       }
  //     },
  //   ),
  // )
}

export default initPassport
