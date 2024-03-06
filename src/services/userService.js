import { User } from '~/schemas/user'

export const getUserByEmail = async (email) => {
  return await User.findOne({ email })
    .select({
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    })
    .lean()
}
