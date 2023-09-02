import { IBase } from './base.interface';
import { IUser } from './users.interface';

export enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}
export interface IFriend extends IBase {
  sender: IUser;
  receiver: IUser;
  status: FriendStatus;
}
