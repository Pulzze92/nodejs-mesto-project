import mongoose from 'mongoose';
import { IUser } from '../types';

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
  toJSON: {
    transform: (_, ret) => {
      const { __v, ...rest } = ret;
      return rest;
    },
  },
});

export default mongoose.model<IUser>('user', userSchema);
