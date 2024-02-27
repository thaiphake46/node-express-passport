import { StatusCodes } from 'http-status-codes'
import { authValidate, userValidate } from '~/Joi'

export const validationAuth = async (req, res, next) => {
  try {
    const value = await authValidate.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY
    next(error)
  }
}

export const validationUser = async (req, res, next) => {
  try {
    const value = await userValidate.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY
    next(error)
  }
}

/**
 * @param {import('joi').ObjectSchema} schema
 */
export const validationReqBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false })
      next()
    } catch (error) {
      error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY
      next(error)
    }
  }
}
