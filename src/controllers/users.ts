import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models';
import { CustomRequest } from '../types';
import STATUS_CODES from '../utils/constants';
import { MongooseError } from '../types';
import jwt from 'jsonwebtoken';
import { BadRequestError, NotFoundError, UnauthorizedError, ConflictError } from '../errors';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id'));
      return;
    }
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id пользователя'));
      return;
    }
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const userResponse = {
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    };

    res.status(STATUS_CODES.CREATED).send(userResponse);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    if (err instanceof Error && (err as MongooseError).code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
      return;
    }
    next(err);
  }
};

export const updateProfile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

export const updateAvatar = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Передана некорректная ссылка на аватар'));
      return;
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const token = jwt.sign(
      { _id: user._id },
      'some-secret-key',
      { expiresIn: '7d' },
    );

    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
        secure: true,
      })
      .send({ message: 'Авторизация успешна' });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id'));
      return;
    }
    next(err);
  }
};

export const getCurrentUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id'));
      return;
    }
    next(err);
  }
};
