import passport from 'passport'
import { UnauthorizedException } from '~/core/ErrorResponse'

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

export const middlewarePassportGoogle = (req, res, next) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next)
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export const middlewarePassportGoogleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) return next(err)

    req.user = user

    next()
  })(req, res, next)
}
