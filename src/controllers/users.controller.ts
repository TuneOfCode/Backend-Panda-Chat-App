import UsersFilter from '@/filters/users.filter';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { IParameter, RequestWithQuery } from '@/interfaces/parameters.interface';
import { delCache, getAllKeys, setCache } from '@/utils/util';
import { ChangePasswordDto, CreateUserDto } from '@dtos/users.dto';
import { IUser } from '@interfaces/users.interface';
import { default as UsersService, default as usersService } from '@services/users.service';
import { NextFunction, Request, Response } from 'express';

class UsersController {
  private readonly userService: UsersService = new usersService();

  public getUsers = async (req: RequestWithQuery, res: Response, next: NextFunction) => {
    try {
      const filters = UsersFilter.transform(req);
      const params: IParameter = {
        filters,
        ...req.queryParams,
      };

      const findAllUsersData: IUser[] = await this.userService.findAllUser(params);

      // add cache data
      await setCache(req.originalUrl, findAllUsersData);

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: IUser = await this.userService.findUserById(userId);

      // add cache data
      await setCache(req.originalUrl, findOneUserData);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: IUser = await this.userService.createUser(userData);

      // remove cache data
      const keys = await getAllKeys();
      const deletedKeys = keys.filter(key => key.includes('users'));
      console.log('===> keys is deleted in create user:', deletedKeys);
      await delCache(deletedKeys);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: CreateUserDto = req.body;
      const updateUserData: IUser = await this.userService.updateUser(userId, userData);

      // remove cache data
      // remove cache data
      const keys = await getAllKeys();
      const deletedKeys = keys.filter(key => key.includes('users'));
      console.log('===> keys is deleted in update user:', deletedKeys);
      await delCache(deletedKeys);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: ChangePasswordDto = req.body;
      const updateUserData: IUser = await this.userService.changePassword(req.user, userId, userData);

      // remove cache data
      const keys = await getAllKeys();
      const deletedKeys = keys.filter(key => key.includes('users'));
      console.log('===> keys is deleted in change password:', deletedKeys);
      await delCache(deletedKeys);

      res.status(200).json({ data: updateUserData, message: 'changed password' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: IUser = await this.userService.deleteUser(userId);

      // remove cache data
      const keys = await getAllKeys();
      const deletedKeys = keys.filter(key => key.includes('users'));
      console.log('===> keys is deleted in delete user:', deletedKeys);
      await delCache(deletedKeys);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
