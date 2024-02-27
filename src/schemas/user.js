import mongoose from 'mongoose'

const COLLECTION_NAME = 'Users'
const DOCUMENT_NAME = 'User'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

export const UserSchema = mongoose.model(DOCUMENT_NAME, userSchema)
