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
  roles?: IRole[];
  conversations?: IConversation[];
}
