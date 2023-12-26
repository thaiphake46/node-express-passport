import mongoose from 'mongoose'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
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
