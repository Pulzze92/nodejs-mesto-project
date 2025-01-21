import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../types';
import { UnauthorizedError } from '../errors';

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload as { _id: string };
    next();
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};