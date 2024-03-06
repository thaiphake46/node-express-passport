import ms from 'ms'
import JWT from 'jsonwebtoken'
import env from '~/config/env'

/**
 * thời gian tính bằng mini giây (mini second)
 */
export const JWT_MAX_AGE_ACCESS_TOKEN = ms(env.JWT_MAX_AGE_ACCESS_TOKEN)
/**
 * thời gian tính bằng mini giây (mini second)
 */
export const JWT_MAX_AGE_REFRESH_TOKEN = ms(env.JWT_MAX_AGE_REFRESH_TOKEN)

export const signAccessToken = (payload) => {
  return JWT.sign(payload, env.JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: JWT_MAX_AGE_ACCESS_TOKEN / 1000, // thời gian tính bằng giây (second)
  })
}

export const signRefreshToken = (payload) => {
  return JWT.sign(payload, env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: JWT_MAX_AGE_REFRESH_TOKEN / 1000, // thời gian tính bằng giây (second)
  })
}
