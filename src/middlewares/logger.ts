import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

export const requestLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
});

export const errorLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  requestLogger.info({
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });
  next();
};

export const logError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  errorLogger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });
  next(err);
};