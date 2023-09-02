import { IBase } from './base.interface';
import { IUser } from './users.interface';

export interface IRole extends IBase {
  name: string;
  users?: IUser[];
}
