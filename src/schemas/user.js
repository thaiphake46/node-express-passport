import mongoose from 'mongoose'
import UserRole from '~/core/userRole'

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
      strategy: { type: String, enum: ['google', 'facebook'] },
      id: { type: String },
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
      type: String,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

export const User = mongoose.model(DOCUMENT_NAME, userSchema)
