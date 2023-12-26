import Joi from 'joi'

export const authValidate = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().required(),
})

export const userValidate = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email(),
  password: Joi.string().required(),
})
