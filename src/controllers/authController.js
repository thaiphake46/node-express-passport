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
import { omitKeys } from '~/helpers/lodash'

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
 * signUpPage
 */
export const signUpPage = (req, res, next) => {
  res.render('auth/signup')
}

/**
 * signUp - local
 */
export const signUp = async (req, res, next) => {
  const { email, password, displayName } = req.body
  const user = await User.findOne({ email }).lean()

  if (user) throw new ConflictException({ message: 'User already exists' })

  const newUser = await User.create({
    displayName,
    email,
    password: await bcrypt.hash(password, 10),
  })

  const payload = { _id: newUser._id, email: newUser.email }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  setCookieSignInSuccess(res, { accessToken, refreshToken })

  await User.updateOne({ email: newUser.email }, { refreshToken })

  // response
  new CreatedSuccess({
    message: 'Sign up success',
    metadata: { user: omitKeys(newUser.toJSON(), ['password', '__v', 'updatedAt', 'createdAt']) },
  }).json(res)
}

/**
 * signInPage
 */
export const signInPage = (req, res, next) => {
  res.render('auth/signin')
}

/**
 * signIn - local
 */
export const signIn = async (req, res, next) => {
  const user = req.user

  const payload = { _id: user._id, email: user.email }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  setCookieSignInSuccess(res, { accessToken, refreshToken })

  await User.updateOne({ email: user.email }, { refreshToken })

  // response
  new OKSuccess({
    message: 'Sign in success',
    metadata: { user: omitKeys(user, ['password']) },
  }).json(res)
}

export const logOut = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)

    req.session.destroy((err) => {
      if (err) return next(err)
    })

    res.clearCookie('accessToken').clearCookie('refreshToken')

    new OKSuccess({ message: 'Logout success' }).json(res)
  })
}

/**
 * signInGoogle
 */
export const signInGoogle = (req, res, next) => {
  const redirectUrl = req.query.redirectUrl
  req.session.redirectUrl = redirectUrl // save redirectUrl to session
  res.redirect('/auth/google')
}

/**
 * signInGoogleCallback
 */
export const signInGoogleCallback = async (req, res, next) => {
  const user = req.user

  const payload = { _id: user._id, email: user.email }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  setCookieSignInSuccess(res, { accessToken, refreshToken })
  await User.updateOne({ email: user.email }, { refreshToken })

  // redirect to client
  // return res.redirect(req.session.redirectUrl)
  res.json({ user })
}
