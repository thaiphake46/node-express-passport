/* eslint-disable no-console */
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

const errorHandling = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  if (!err.msg) err.msg = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
  if (!err.error) err.error = getReasonPhrase(err.statusCode)

  console.error(err)

  return res.status(err.statusCode).json(err)
}

export default errorHandling
