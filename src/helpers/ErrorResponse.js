import { StatusCodes, ReasonPhrases } from 'http-status-codes'

export class ErrorResponse extends Error {
  constructor(message, statusCode = StatusCodes.BAD_REQUEST, options = {}) {
    super(message)
    this.name = 'ErrorResponse'
    this.statusCode = statusCode
    this.msg = message
    // eslint-disable-next-line no-undefined
    this.options = options && Object.keys(options) > 0 ? options : undefined
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ConflictException extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, options = {}, status = StatusCodes.CONFLICT) {
    super(message, status, options)
    this.name = 'ConflictException'
  }
}

export class UnauthorizedException extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    options = {},
    status = StatusCodes.UNAUTHORIZED,
  ) {
    super(message, status, options)
    this.name = 'UnauthorizedException'
  }
}

export class NotFoundException extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, options = {}, status = StatusCodes.NOT_FOUND) {
    super(message, status, options)
    this.name = 'NotFoundException'
  }
}

export class UnprocessableEntityException extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNPROCESSABLE_ENTITY,
    options = {},
    status = StatusCodes.UNPROCESSABLE_ENTITY,
  ) {
    super(message, status, options)
    this.name = 'UnprocessableEntityException'
  }
}
