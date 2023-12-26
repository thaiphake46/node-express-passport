import ms from 'ms'
import JWT from 'jsonwebtoken'

export const JWT_MAX_AGE_ACCESS_TOKEN = ms(process.env.JWT_MAX_AGE_ACCESS_TOKEN)
export const JWT_MAX_AGE_REFRESH_TOKEN = ms(process.env.JWT_MAX_AGE_REFRESH_TOKEN)

export const signAccessToken = (payload) => {
  return JWT.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: JWT_MAX_AGE_ACCESS_TOKEN / 1000,
  })
}

export const signRefreshToken = (payload) => {
  return JWT.sign(payload, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: JWT_MAX_AGE_REFRESH_TOKEN / 1000,
  })
}
