import { StatusCodes } from 'http-status-codes'

/**
 * @param {import('joi').ObjectSchema} schema
 */
export const validationReqBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY
      next(error)
    }

    next()
  }
}
