import bcrypt from 'bcrypt'
import { UserSchema } from '~/schemas/user'
import { pickKeys } from '~/utils'
import { ConflictException } from '~/helpers/ErrorResponse'
import { JWT_MAX_AGE_REFRESH_TOKEN, signAccessToken, signRefreshToken } from '~/services/jwtService'

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body
  const user = await UserSchema.findOne({ email }).lean()

  if (user) throw new ConflictException(`User already`)

  const newUser = await UserSchema.create({
    username,
    email,
    password: await bcrypt.hash(password, 10),
  })

  return res.json({
    msg: 'Sign up success',
    user: pickKeys(newUser.toJSON(), ['_id', 'username', 'email']),
  })
}

export const signIn = (req, res, next) => {
  const user = req.user

  const payload = { sub: user._id, email: user.email }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: JWT_MAX_AGE_REFRESH_TOKEN,
    sameSite: 'strict',
  })

  return res.status(200).json({
    token: {
      accessToken,
      refreshToken,
    },
    user: pickKeys(user, ['_id', 'username', 'email']),
  })
}
