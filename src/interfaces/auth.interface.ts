import { Request } from 'express';
import { IUser } from '@interfaces/users.interface';
import { Schema } from 'mongoose';

export interface DataStoredInToken {
  _id: Schema.Types.ObjectId | string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: IUser;
}
