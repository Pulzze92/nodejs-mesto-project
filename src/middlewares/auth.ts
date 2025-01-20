import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../types';
import STATUS_CODES from '../utils/constants';

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  try {
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload as { _id: string };
    next();
  } catch (err) {
    return res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
};