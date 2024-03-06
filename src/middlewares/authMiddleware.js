import jwt, { decode } from 'jsonwebtoken'
import passport from 'passport'
import env from '~/config/env'
import { UnauthorizedException } from '~/core/ErrorResponse'
import { JWT_MAX_AGE_ACCESS_TOKEN, signAccessToken } from '~/services/jwtService'
import { getUserById } from '~/services/userService'

/**
 * passport local
 */
export const middlewarePassportLocal = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)

    if (!user) return next(new UnauthorizedException({ message: info.message }))

    req.user = user
    next()
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
 *
 */
export const verifyJwtTokenCookie = async (req, res, next) => {
  let { accessToken, refreshToken } = req.cookies

  console.log('verifyJwtTokenCookie', __filename)
  console.log('cookies', req.cookies)

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

    console.log(__filename, 'verifyJwtTokenCookie', decodeRT)

    const user = await getUserById(decodeRT.sub)

    console.log(__filename, 'verifyJwtTokenCookie', user)

    if (refreshToken !== user.refreshToken) {
      return next(new UnauthorizedException({ message: 'Login session expired' }))
    }

    // accessToken = signAccessToken()
    accessToken = jwt.sign({ email: user.email }, env.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: JWT_MAX_AGE_ACCESS_TOKEN / 1000, // thời gian tính bằng giây (second)
      subject: user._id.toString(),
    })

    return res.json({ accessToken, refreshToken })
  }
  return res.json({ accessToken, refreshToken })

  // req.user = decodeAT
  // next()
}
