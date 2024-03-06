import { User } from '~/schemas/user'

export const getUserByEmail = async (email) => {
  return await User.findOne({ email })
    .select({
      // password: 0,
      createdAt: 0,
      updatedAt: 0,
      refreshToken: 0,
      __v: 0,
    })
    .lean()
}

export const getUserById = async (_id) => {
  return await User.findById(_id)
    .select({
      // password: 0,
      createdAt: 0,
      updatedAt: 0,
      refreshToken: 0,
      __v: 0,
    })
    .lean()
}
