import { IBase } from './base.interface';
import { IUser } from './users.interface';

export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  JOIN_GROUP = 'join_group',
  MESSAGE = 'message',
}

export interface INotification extends IBase {
  sender: IUser;
  recipient: IUser;
  type: NotificationType;
  content: string;
  thumbnail: string;
  readedAt: Date;
  deletedAt: Date;
}
