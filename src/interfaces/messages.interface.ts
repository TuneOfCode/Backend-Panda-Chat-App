import { IBase } from './base.interface';
import { IConversation } from './conversations.interface';
import { IUser } from './users.interface';

export interface IMessage extends IBase {
  sender: IUser;
  conversation: IConversation;
  text: string;
  file: string;
  parent?: IMessage;
  recalledAt?: Date; // thu hồi tin nhắn từ 2 phía
}
