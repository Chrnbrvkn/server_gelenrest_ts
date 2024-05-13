/* eslint-disable @typescript-eslint/no-explicit-any */
export class ApiError extends Error {
  public statusCode: number;
  public details: any;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, details?: any, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, details?: any) {
    super(400, message, details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(404, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(403, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(401, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string, details?: any) {
    super(500, message, details, false);
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string, details?: any) {
    super(500, message, details, false);
  }
}

export class ConnectionError extends ApiError {
  constructor(message: string, details?: any) {
    super(500, message, details, false);
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string, details?: any) {
    super(408, message, details);
  }
}

export class OptimisticLockError extends ApiError {
  constructor(message: string, details?: any) {
    super(409, message, details);
  }
}
export class TransactionError extends ApiError {
  constructor(message: string, details?: any) {
    super(409, message, details);
  }
}
