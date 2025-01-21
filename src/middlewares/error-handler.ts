import { Request, Response, NextFunction } from 'express';
import STATUS_CODES from '../utils/constants';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  if (err.code === 11000) {
    res.status(STATUS_CODES.CONFLICT).send({ message: 'Пользователь с таким email уже существует' });
    return;
  }

  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
};