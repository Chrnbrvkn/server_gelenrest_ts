import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiError = (e: any, req: Request, res: Response) => {

  let statusCode = e.statusCode || 500;
  let message = e.message || 'Произошла внутренняя ошибка сервера.';
  let details = e.details || null;
  
  switch (e.name) {
  case 'SequelizeValidationError':
    statusCode = 400;
    message = 'Ошибка валидации';
    details = e.errors;
    break;
  case 'SequelizeUniqueConstraintError':
    statusCode = 400;
    message = 'Ошибка уникальности';
    details = e.errors;
    break;
  case 'SequelizeDatabaseError':
    statusCode = 500;
    message = 'Ошибка базы данных';
    details = {
      message: e.message,
      sql: e.sql
    };
    break;
  case 'SequelizeConnectionError':
    statusCode = 500;
    message = 'Ошибка подключения к базе данных';
    details = e.parent.error;
    break;
  case 'SequelizeTimeoutError':
    statusCode = 500;
    message = 'Время ожидания ответа базы данных истекло';
    details = null;
    break;
  case 'SequelizeForeignKeyConstraintError':
    statusCode = 500;
    message = e.message;
    details = e.sql;
    break;
  case 'SequelizeTransactionError':
    statusCode = 500;
    message = e.message;
    details = e.parent;
    break;
  case 'SequelizeOptimisticLockError':
    statusCode = 500;
    message = e.message;
    details = null;
    break;
  default:
    statusCode = e.statusCode || 500;
    message = e.message || 'Внутренняя ошибка сервера';
    details = e.details || e;
    break;
  }

  if (!res.headersSent) {
    res.status(statusCode).json({
      error: {
        message: message,
        detail: details
      }
    });
  } else {
    console.error('Attempt to send an error response after headers were sent.');
  }
};
