import jwt from 'jsonwebtoken'
import passport from 'passport'
import env from '~/config/env'
import { UnauthorizedException } from '~/core/ErrorResponse'
import { signAccessToken } from '~/services/jwtService'
import { getUserById } from '~/services/userService'

/**
 * passport local
 */
export const middlewarePassportLocal = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return next(new UnauthorizedException({ message: info.message }))

    req.login(user, (err) => {
      if (err) return next(err)
      return next()
    })
  })(req, res, next)
}

/**
 * passport jwt
 */
export const middlewarePassportJwt = (req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) return next(err)

    if (!user) return next(new UnauthorizedException({ message: info.message }))

    req.user = user
    next()
  })(req, res)
}

/**
 * passport google
 */
export const middlewarePassportGoogle = (req, res, next) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next)
}

export const middlewarePassportGoogleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) return next(err)
    if (!user) return next(new UnauthorizedException({ message: info.message }))

    req.user = user

    next()
  })(req, res, next)
}

/**
 * verifyJwtTokenCookie
 */
export const verifyJwtTokenCookie = async (req, res, next) => {
  let { accessToken, refreshToken } = req.cookies

  /**
   * TODO
   * 1 lấy ra accessToken và refreshToken từ cookie
   * 2 kiểm tra nếu không có accessToken -> 3
   * 3 nếu không có refreshToken thì trả về lỗi UnauthorizedException
   * 4 sử dụng refreshToken để tạo lại cookie accessToken
   * -- giải mã refreshToken
   * -- tìm user trong db
   * -- so sánh refreshToken hiện tại với refreshToken lưu trong db === ? true : false
   * 5 trả về thông tin nếu jwt token hợp lệ
   */

  if (!accessToken) {
    if (!refreshToken) {
      return next(new UnauthorizedException({ message: 'Login session expired' }))
    }

    const decodeRT = jwt.verify(refreshToken, env.JWT_SECRET_REFRESH_TOKEN)

    const user = await getUserById(decodeRT.sub)

    if (refreshToken !== user?.refreshToken) {
      return next(new UnauthorizedException({ message: 'Login session expired' }))
    }

    const payload = { email: user.email, _id: user._id }

    accessToken = signAccessToken(payload)

    return res.json({ accessToken, refreshToken })
  }
  return res.json({ accessToken, refreshToken })
}
/**
 *
 * @param {Request} req
 * @param {*} res
 */
export const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.path === '/auth/signup' || req.path === '/auth/signin') {
      res.redirect('/')
    }

    return next()
  } else {
    return res.redirect('/login')
  }
}
