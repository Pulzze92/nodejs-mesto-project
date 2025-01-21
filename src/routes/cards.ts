import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import auth from '../middlewares/auth';
import { validateCardBody, validateCardId } from '../validators/cards';

const router = Router();

router.get('/', auth, getCards);
router.post('/', auth, validateCardBody, createCard);
router.delete('/:cardId', auth, validateCardId, deleteCard);
router.put('/:cardId/likes', auth, validateCardId, likeCard);
router.delete('/:cardId/likes', auth, validateCardId, dislikeCard);

export default router;
