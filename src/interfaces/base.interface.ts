import { Schema } from 'mongoose';

export interface IBase {
  _id: Schema.Types.ObjectId | string;
  deletedAt?: Date;
}
