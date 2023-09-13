import { IBase } from './base.interface';
import { IConversation } from './conversations.interface';
import { IMessageRecipient } from './messageRecipients.interface';
import { IUser } from './users.interface';

export interface IMessage extends IBase {
  sender: IUser;
  conversation: IConversation;
  text: string;
  files: string[];
  parent?: IMessage;
  messageRecipients?: IMessageRecipient[];
  recalledAt?: Date; // thu hồi tin nhắn từ 2 phía
}
