import { StatusCodes, getReasonPhrase } from 'http-status-codes'

const errorHandling = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  if (!err.message) err.statusCode = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)

  err.error = getReasonPhrase(err.statusCode)
  console.log(err)

  return res.status(err.statusCode).json(err)
}

export default errorHandling
