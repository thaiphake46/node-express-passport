import passport from 'passport'
import { UnauthorizedException } from '~/helpers/ErrorResponse'

export const middlewarePassportLocal = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err)

    if (!user) return next(new UnauthorizedException(`Username or password incorrect`))

    req.user = user
    next()
  })(req, res, next)
}

export const middlewarePassportJwt = (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if (err) return next(err)

    if (!user) return next(new UnauthorizedException(`Invalid token`))

    req.user = user
    next()
  })(req, res)
}
