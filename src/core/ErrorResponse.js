import { ReasonPhrases, StatusCodes, getReasonPhrase } from 'http-status-codes'

export class ErrorResponse extends Error {
  constructor({ message, statusCode, options }) {
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
  constructor(config = { message: ReasonPhrases.UNPROCESSABLE_ENTITY, options: {} }) {
    super({
      message: config.message,
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
    })
    this.name = 'ValidationException'
    this.error = config.options?.details.map((detail) => {
      return { message: detail.message }
    })
  }
}

/**
 * HTTP Exception
 */
export class BadRequestException extends ErrorResponse {
  constructor(
    config = {
      message: ReasonPhrases.BAD_REQUEST,
      options: {},
    },
  ) {
    super({
      message: config.message,
      statusCode: StatusCodes.BAD_REQUEST,
      options: config.options,
    })
    this.name = 'BadRequestException'
  }
}

export class UnauthorizedException extends ErrorResponse {
  constructor(
    config = {
      message: ReasonPhrases.UNAUTHORIZED,
      options: {},
    },
  ) {
    super({
      message: config.message,
      statusCode: StatusCodes.UNAUTHORIZED,
      options: config.options,
    })
    this.name = 'UnauthorizedException'
  }
}

export class NotFoundException extends ErrorResponse {
  constructor(
    config = {
      message: ReasonPhrases.NOT_FOUND,
      options: {},
    },
  ) {
    super({
      message: config.message,
      statusCode: StatusCodes.NOT_FOUND,
      options: config.options,
    })
    this.name = 'NotFoundException'
  }
}

export class ConflictException extends ErrorResponse {
  constructor(
    config = {
      message: ReasonPhrases.CONFLICT,
      options: {},
    },
  ) {
    super({
      message: config.message,
      statusCode: StatusCodes.CONFLICT,
      options: {},
    })
    this.name = 'ConflictException'
  }
}

export class UnprocessableEntityException extends ErrorResponse {
  constructor(
    config = {
      message: ReasonPhrases.UNPROCESSABLE_ENTITY,
      options: {},
    },
  ) {
    super({
      message: config.message,
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      options: config.options,
    })
    this.name = 'UnprocessableEntityException'
  }
}
