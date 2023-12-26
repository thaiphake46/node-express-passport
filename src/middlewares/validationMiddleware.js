import { StatusCodes } from 'http-status-codes'
import { authValidate, userValidate } from '~/validations'

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
