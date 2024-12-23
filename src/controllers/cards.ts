import { Response } from 'express';
import { Card } from '../models';
import { CustomRequest } from '../types';

export const getCards = async (req: CustomRequest, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return res.status(500).send({ message: 'Произошла ошибка при получении карточек' });
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
    return res.status(500).send({ message: 'Произошла ошибка при создании карточки' });
  }
};

export const deleteCard = async (req: CustomRequest, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    return res.send(card);
  } catch (err) {
    return res.status(500).send({ message: 'Произошла ошибка при удалении карточки' });
  }
};
