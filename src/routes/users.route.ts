import { RoleType } from '@/interfaces/roles.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import authorizeMiddleware from '@/middlewares/authorize.middleware';
import cacheMiddleware from '@/middlewares/cache.middleware';
import queryMiddleware from '@/middlewares/query.middleware';
import UsersController from '@controllers/users.controller';
import { ChangePasswordDto, CreateUserDto } from '@dtos/users.dto';
import { IRoutes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { Router } from 'express';

class UsersRoute implements IRoutes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, queryMiddleware, cacheMiddleware, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, cacheMiddleware, this.usersController.getUserById);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      authorizeMiddleware(RoleType.ADMIN),
      validationMiddleware(CreateUserDto, 'body'),
      this.usersController.createUser,
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      authorizeMiddleware(RoleType.ADMIN),
      validationMiddleware(CreateUserDto, 'body', true),
      this.usersController.updateUser,
    );
    this.router.patch(
      `${this.path}/:id/change-password`,
      authMiddleware,
      authorizeMiddleware(RoleType.MEMBER),
      validationMiddleware(ChangePasswordDto, 'body', true),
      this.usersController.changePassword,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, authorizeMiddleware(RoleType.ADMIN), this.usersController.deleteUser);
  }
}

export default UsersRoute;
