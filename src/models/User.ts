import mongoose, { Document } from 'mongoose';
import { IUser } from '../interfaces';

interface UserDocument extends Document, IUser {}

const userSchema = new mongoose.Schema({
  name: String,
  about: String,
  avatar: String,
});

export default mongoose.model<UserDocument>('user', userSchema);
