import { IBase } from './base.interface';
import { IMessage } from './messages.interface';
import { IUser } from './users.interface';

export interface IMessageRecipient extends IBase {
  recipient: IUser;
  message: IMessage;
  readedAt: Date;
}
