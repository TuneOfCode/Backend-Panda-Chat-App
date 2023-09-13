import { IBase } from './base.interface';
import { IConversation } from './conversations.interface';
import { IRole } from './roles.interface';

export interface IUser extends IBase {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  avatar: string;
  address: string;
  // verifiedEmail: boolean;
  refreshToken: string;
  offlineAt?: Date; // last time user offline order to show online status. Ex: 1 minute ago
  roles?: IRole[];
  conversations?: IConversation[];
  friends?: IUser[];
}
