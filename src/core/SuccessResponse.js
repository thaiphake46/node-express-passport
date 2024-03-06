import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export class SuccessResponse {
  constructor({ message, statusCode, metadata, options }) {
    this.statusCode = statusCode ?? StatusCodes.OK
    this.success = getReasonPhrase(this.statusCode)
    this.msg = message || getReasonPhrase(this.statusCode)
    this.metadata = metadata instanceof Object && Object.keys(metadata).length > 0 ? metadata : {}
    this.options = options instanceof Object && Object.keys(options).length > 0 ? options : {}
  }

  json(res) {
    return res.status(this.statusCode).json(this)
  }
}

// OK
export class OKSuccess extends SuccessResponse {
  constructor({ message, metadata, options }) {
    super({ message, statusCode: StatusCodes.OK, metadata, options })
  }
}

// CREATED
export class CreatedSuccess extends SuccessResponse {
  constructor({ message, metadata, options }) {
    super({ message, statusCode: StatusCodes.CREATED, metadata, options })
  }
}
