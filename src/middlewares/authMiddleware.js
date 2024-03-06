import jwt from 'jsonwebtoken'
import passport from 'passport'
import env from '~/config/env'
import { UnauthorizedException } from '~/core/ErrorResponse'
import { User } from '~/schemas/user'

export const middlewarePassportLocal = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)

    if (!user) return next(new UnauthorizedException(info.message))

    req.user = user
    next()
  })(req, res, next)
}

export const middlewarePassportJwt = (req, res, next) => {
  passport.authenticate('jwt', (err, user, { message }) => {
    if (err) return next(err)

    if (!user) return next(new UnauthorizedException(message))

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

/**
 * @param {Request} req
 * @param {Response} res
 */
export const verifyJwtTokenCookie = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies

  if (!refreshToken) {
    return next(new UnauthorizedException())
  }
  if (refreshToken && !accessToken) {
    const decodeRT = jwt.verify(refreshToken, env.JWT_SECRET_REFRESH_TOKEN)

    const user = await User.findById(decodeRT.sub).lean()
  }

  // const decodeAT = jwt.verify(accessToken, env.JWT_SECRET_ACCESS_TOKEN)

  // req.user = decodeAT
  // next()
}
