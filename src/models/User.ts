import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { IUser } from '../types';

const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+\.[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=#]*$/;

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => urlRegex.test(v),
      message: 'Некорректный формат URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false,
  toJSON: {
    transform: (_, ret) => {
      const { password, __v, ...rest } = ret;
      return rest;
    },
  },
});

export default mongoose.model<IUser>('user', userSchema);