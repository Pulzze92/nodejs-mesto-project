import { Request, Response } from 'express';
import { User } from '../models';
import { CustomRequest } from '../types';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный id пользователя' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
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
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Передана некорректная ссылка на аватар' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
