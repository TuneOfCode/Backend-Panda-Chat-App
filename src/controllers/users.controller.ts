import { connectToRedis } from '@/cache';
import UsersFilter from '@/filters/users.filter';
import { ICacheUserKey } from '@/interfaces/caches.interface';
import { IParameter, RequestWithQuery, SortType } from '@/interfaces/parameters.interface';
import { logger } from '@/utils/logger';
import { delCache, setCache } from '@/utils/util';
import { CreateUserDto } from '@dtos/users.dto';
import { IUser } from '@interfaces/users.interface';
import { default as UsersService, default as usersService } from '@services/users.service';
import { NextFunction, Request, Response } from 'express';

class UsersController {
  private readonly userService: UsersService = new usersService();
  public cacheKeys: ICacheUserKey = {
    getUsers: '',
    getUserById: '',
  };

  public getUsers = async (req: RequestWithQuery, res: Response, next: NextFunction) => {
    try {
      const filters = UsersFilter.transform(req);
      const params: IParameter = {
        filters,
        ...req.queryParams,
      };

      const findAllUsersData: IUser[] = await this.userService.findAllUser(params);

      // // add cache data
      // this.cacheKeys.getUsers = req.originalUrl || req.url;
      // await setCache(this.cacheKeys.getUsers, findAllUsersData);

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
      this.cacheKeys.getUserById = req.originalUrl || req.url;
      await setCache(this.cacheKeys.getUserById, findOneUserData);

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
      await delCache([this.cacheKeys.getUsers, this.cacheKeys.getUserById]);

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
      await delCache([this.cacheKeys.getUsers, this.cacheKeys.getUserById]);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: IUser = await this.userService.deleteUser(userId);

      // remove cache data
      logger.info('delete cache ....');
      await delCache([this.cacheKeys.getUsers, this.cacheKeys.getUserById]);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
