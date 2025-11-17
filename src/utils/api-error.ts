/**
 * Custom Error Classes for API
 * Structured error handling with proper HTTP status codes
 */

/**
 * Base API Error Class
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    // Set prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 400 Bad Request Error
 */
export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(400, message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource Not Found') {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends ApiError {
  constructor(message = 'Resource Conflict') {
    super(409, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * 422 Unprocessable Entity Error
 */
export class UnprocessableEntityError extends ApiError {
  constructor(message = 'Unprocessable Entity') {
    super(422, message);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error') {
    super(500, message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * 503 Service Unavailable Error
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message = 'Service Unavailable') {
    super(503, message);
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

/**
 * Relayer API Error
 * Special error class for external API failures
 */
export class RelayerApiError extends ApiError {
  relayerStatus: number;
  relayerMessage: string;

  constructor(statusCode: number, message: string, relayerStatus: number, relayerMessage: string) {
    super(statusCode, message);
    this.relayerStatus = relayerStatus;
    this.relayerMessage = relayerMessage;
    Object.setPrototypeOf(this, RelayerApiError.prototype);
  }
}

/**
 * Validation Error
 */
export class ValidationError extends ApiError {
  validationErrors: Record<string, string>;

  constructor(message: string, validationErrors: Record<string, string> = {}) {
    super(422, message);
    this.validationErrors = validationErrors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Database Error
 */
export class DatabaseError extends ApiError {
  constructor(message = 'Database operation failed') {
    super(500, message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
