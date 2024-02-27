import Joi from 'joi'

export const signUpValid = Joi.object({
  displayName: Joi.string().min(3).max(20).trim().required(),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(12).required(),
})

export const signInValid = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
})
