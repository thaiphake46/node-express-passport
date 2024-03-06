import bcrypt from 'bcrypt'
import { User } from '~/schemas/user'
import { ConflictException } from '~/core/ErrorResponse'
import { CreatedSuccess, OKSuccess } from '~/core/SuccessResponse'
import {
  JWT_MAX_AGE_ACCESS_TOKEN,
  JWT_MAX_AGE_REFRESH_TOKEN,
  signAccessToken,
  signRefreshToken,
} from '~/services/jwtService'

const setCookieSignInSuccess = (res, { accessToken, refreshToken }) => {
  // set cookie after sign up / sign in
  res
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: JWT_MAX_AGE_ACCESS_TOKEN,
      sameSite: 'strict',
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: JWT_MAX_AGE_REFRESH_TOKEN,
      sameSite: 'strict',
    })
}

/**
 * signUp - local
 */
export const signUp = async (req, res, next) => {
  const { email, password, displayName } = req.body
  const user = await User.findOne({ email }).lean()

  if (user) throw new ConflictException(`User already`)

  const newUser = await User.create({
    displayName,
    email,
    password: await bcrypt.hash(password, 10),
  })

  const payload = { sub: newUser._id, email: newUser.email }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  setCookieSignInSuccess(res, { accessToken, refreshToken })

  // response CreatedSuccess
  return res.json(new CreatedSuccess())
}

/**
 * signIn - local
 */
export const signIn = (req, res, next) => {
  const user = req.user

  const payload = { sub: user._id, email: user.email }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  setCookieSignInSuccess(res, { accessToken, refreshToken })

  return res.status(200).json(new OKSuccess())
}

/**
 * signInGoogle
 */
export const signInGoogle = (req, res, next) => {
  const redirectUrl = req.query.redirectUrl
  req.session.redirectUrl = redirectUrl
  res.redirect('/auth/google')
}

/**
 * signInGoogleCallback
 */
export const signInGoogleCallback = (req, res, next) => {
  const user = req.user

  const payload = { sub: user._id, email: user.email }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  setCookieSignInSuccess(res, { accessToken, refreshToken })

  // redirect to client
  return res.redirect(req.session.redirectUrl)
}
