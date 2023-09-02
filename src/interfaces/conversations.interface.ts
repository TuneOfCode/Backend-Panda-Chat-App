import { IBase } from './base.interface';
import { IUser } from './users.interface';

export enum ConversationType {
  PRIVATE = 'private',
  GROUP = 'group',
}

export interface IConversation extends IBase {
  name: string;
  avatar: string;
  type: ConversationType;
  onwer: IUser;
  members: IUser[];
}
