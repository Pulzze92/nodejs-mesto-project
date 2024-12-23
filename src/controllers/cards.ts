import { Response } from 'express';
import { Card } from '../models';
import { CustomRequest } from '../types';

export const getCards = async (req: CustomRequest, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const createCard = async (req: CustomRequest, res: Response) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({
      name,
      link,
      owner: req.user?._id,
    });
    return res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные карточки' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const deleteCard = async (req: CustomRequest, res: Response) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    await card.remove();
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный id карточки' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const addLike = async (req: CustomRequest, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный id карточки' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const removeLike = async (req: CustomRequest, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный id карточки' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
