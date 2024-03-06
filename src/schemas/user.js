import mongoose from 'mongoose'
import UserSocicalProvider from '~/helpers/userSocicalProvider'
import UserRole from '~/helpers/userRole'
import { JWT_MAX_AGE_REFRESH_TOKEN } from '~/services/jwtService'

const COLLECTION_NAME = 'Users'
const DOCUMENT_NAME = 'User'

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    provider: {
      strategy: {
        type: String,
        enum: [UserSocicalProvider.LOCAL, UserSocicalProvider.GOOGLE, UserSocicalProvider.FACEBOOK],
      },
      id: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: [UserRole.ROOT, UserRole.ADMIN, UserRole.USER],
      default: UserRole.USER,
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      expires: JWT_MAX_AGE_REFRESH_TOKEN / 1000, // thời gian tính bằng giây (second)
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

export const User = mongoose.model(DOCUMENT_NAME, userSchema)
