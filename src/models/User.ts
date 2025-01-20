import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { IUser } from '../types';
import bcrypt from 'bcryptjs';

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

userSchema.static('findUserByCredentials', async function findUserByCredentials({ email, password }: { email: string, password: string }) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    return null;
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return null;
  }
  return user;
});

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (data: { email: string, password: string }) => Promise<IUser | null>;
}

export default mongoose.model<IUser, UserModel>('user', userSchema);
