import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import AppError from './AppError';

interface ValidationErros {
  [key: string]: string[];
}

const errorHandler: ErrorRequestHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof ValidationError) {
    let errors: ValidationErros = {};
    error.inner.forEach((err) => {
      errors[err.path] = err.errors;
    });

    return response.status(400).json({
      message: 'Validation fails',
      errors: errors,
    });
  } else if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  } else {
    console.error(error);
    return response.status(500).json({
      message: error.message,
    });
  }
};

export default errorHandler;
