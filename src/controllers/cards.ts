import { Response } from 'express';
import { Card } from '../models';
import { CustomRequest } from '../types';
import STATUS_CODES from '../utils/constants';

export const getCards = async (req: CustomRequest, res: Response) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
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
    res.status(STATUS_CODES.CREATED).send(card);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      return;
    }
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

export const deleteCard = async (req: CustomRequest, res: Response) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      return;
    }
    await card.remove();
    res.send(card);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
      return;
    }
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

export const likeCard = async (req: CustomRequest, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      return;
    }
    res.send(card);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      return;
    }
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

export const dislikeCard = async (req: CustomRequest, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      return;
    }
    res.send(card);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      return;
    }
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};
