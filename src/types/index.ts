import { Request } from 'express';
import { Types } from 'mongoose';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  _id: Types.ObjectId;
  email: string;
  password: string;
}

export interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
  _id: Types.ObjectId;
}

export interface CustomRequest extends Request {
  user?: {
    _id: string;
  };
}

export interface MongooseError extends Error {
  code?: number;
  name: string;
}
