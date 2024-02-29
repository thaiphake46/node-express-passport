import bcrypt from 'bcrypt'
import { User } from '~/schemas/user'
import { omitKeys, pickKeys } from '~/utils'
import { ConflictException } from '~/core/ErrorResponse'
import { CreatedSuccess, OKSuccess, SuccessResponse } from '~/core/SuccessResponse'
import {
  JWT_MAX_AGE_ACCESS_TOKEN,
  JWT_MAX_AGE_REFRESH_TOKEN,
  signAccessToken,
  signRefreshToken,
} from '~/services/jwtService'

/**
 * signUp - local
 * @param {Request} req
 * @param {Response} res
 */
export const signUp = async (req, res, next) => {
  const { username, email, password, displayName } = req.body
  const user = await User.findOne({ email }).lean()

  if (user) throw new ConflictException(`User already`)

  const newUser = await User.create({
    displayName,
    username,
    email,
    password: await bcrypt.hash(password, 10),
  })

  // return CreatedSuccess
  return res.json({})
}

/**
 * signIn - local
 * @param {Request} req
 * @param {Response} res
 */
export const signIn = (req, res, next) => {
  const user = req.user

  const payload = { sub: user._id, email: user.email }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

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

  // return OKSuccess
  return res.status(200).json({})
}

/**
 * signInGoogle
 * @param {Request} req
 * @param {Response} res
 */
export const signInGoogle = (req, res, next) => {
  const redirectUrl = req.query.redirectUrl
  req.session.redirectUrl = redirectUrl
  res.redirect('/auth/google')
}

/**
 * signInGoogleCallback
 * @param {Request} req
 * @param {Response} res
 */
export const signInGoogleCallback = (req, res, next) => {
  const user = req.user
  const payload = { sub: user._id, email: user.email }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

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

  return res.redirect(req.session.redirectUrl)
}
