import { Request, Response } from 'express';
import { User } from '../models';
import { CustomRequest } from '../types';
import STATUS_CODES from '../utils/constants';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
      return;
    }
    res.send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Передан некорректный id пользователя' });
      return;
    }
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(STATUS_CODES.CREATED).send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      return;
    }
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
      return;
    }
    res.send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateAvatar = async (req: CustomRequest, res: Response) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Передана некорректная ссылка на аватар' });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};
