import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export class ErrorResponse extends Error {
  constructor(message, statusCode, options) {
    super(message)
    this.name = 'ErrorResponse'
    this.statusCode = statusCode ?? StatusCodes.BAD_REQUEST
    this.msg = message || getReasonPhrase(this.statusCode)
    this.options = options instanceof Object && Object.keys(options).length > 0 ? options : {}
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Joi Validation Exception
 */
export class ValidationException extends ErrorResponse {
  constructor(message, options) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY)
    this.name = 'ValidationException'
    this.error = options?.details.map((detail) => {
      return { message: detail.message }
    })
  }
}

/**
 * HTTP Exception
 */
export class BadRequestException extends ErrorResponse {
  constructor(message, options) {
    super(message, StatusCodes.BAD_REQUEST, options)
    this.name = 'BadRequestException'
  }
}

export class UnauthorizedException extends ErrorResponse {
  constructor(message, options) {
    super(message, StatusCodes.UNAUTHORIZED, options)
    this.name = 'UnauthorizedException'
  }
}

export class NotFoundException extends ErrorResponse {
  constructor(message, options) {
    super(message, StatusCodes.NOT_FOUND, options)
    this.name = 'NotFoundException'
  }
}

export class ConflictException extends ErrorResponse {
  constructor(message, options) {
    super(message, StatusCodes.CONFLICT, options)
    this.name = 'ConflictException'
  }
}

export class UnprocessableEntityException extends ErrorResponse {
  constructor(message, options) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, options)
    this.name = 'UnprocessableEntityException'
  }
}
