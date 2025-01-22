import { Response, NextFunction } from 'express';
import { Card } from '../models';
import { CustomRequest } from '../types';
import STATUS_CODES from '../utils/constants';
import { NotFoundError, ForbiddenError, BadRequestError } from '../errors';

export const getCards = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({
      name,
      link,
      owner: req.user?._id,
    });
    res.status(STATUS_CODES.CREATED).send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      return;
    }
    next(err);
  }
};

export const deleteCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }

    if (card.owner.toString() !== req.user?._id) {
      throw new ForbiddenError('Нет прав на удаление чужой карточки');
    }

    await card.remove();
    res.send(card);
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      return;
    }
    next(err);
  }
};

export const dislikeCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      return;
    }
    next(err);
  }
};
