import { Types } from 'mongoose';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  _id: Types.ObjectId;
}

export interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
  _id: Types.ObjectId;
}
