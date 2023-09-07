import { Request } from 'express';
import { RequestWithUser } from './auth.interface';

export type RequestWithCache = Request & { cacheKeys: string[] } & RequestWithUser;

export interface ICacheUserKey {
  getUsers: string;
  getUserById: string;
}

export interface ICacheRoleKey {
  getRoles: string;
  getRoleById: string;
}
