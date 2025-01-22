import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users';
import auth from '../middlewares/auth';
import {
  validateUserId,
  validateUserUpdate,
  validateAvatar,
} from '../validators/users';

const router = Router();

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.get('/:userId', auth, validateUserId, getUserById);
router.patch('/me', auth, validateUserUpdate, updateProfile);
router.patch('/me/avatar', auth, validateAvatar, updateAvatar);

export default router;
