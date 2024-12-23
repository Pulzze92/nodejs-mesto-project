import { Request, Response } from 'express';
import { User } from '../models';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка при получении пользователей' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).send({ message: 'Пользователь с таким id не был найден' });
    }

    return res.send(user);
  } catch (err) {
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });

    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ message: 'Неверные данные' });
  }
};
