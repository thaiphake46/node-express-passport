import { User } from '~/schemas/user'

export const getUserByEmail = async (email) => {
  return await User.findOne({ email })
    .select({
      _id: 1,
      displayName: 1,
      email: 1,
      email_verified: 1,
      provider: 1,
      role: 1,
      avatar: 1,
    })
    .lean()
}
