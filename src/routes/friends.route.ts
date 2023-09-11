import FriendsController from '@/controllers/friends.controller';
import { CreateFriendRequestDto } from '@/dtos/friends.dto';
import { IRoutes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import queryMiddleware from '@/middlewares/query.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';

class FriendsRoute implements IRoutes {
  public path = '/friends';
  public router = Router();
  public friendsController = new FriendsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, queryMiddleware, this.friendsController.getAllFriendRequestOfMe);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateFriendRequestDto, 'body'),
      this.friendsController.createFriendRequest,
    );
    this.router.get(`${this.path}/:id`, authMiddleware, this.friendsController.getFriendRequestById);
    this.router.patch(`${this.path}/:id/accept`, authMiddleware, this.friendsController.acceptFriendRequest);
    this.router.patch(`${this.path}/:id/reject`, authMiddleware, this.friendsController.rejectFriendRequest);
    this.router.patch(`${this.path}/:id/cancel`, authMiddleware, this.friendsController.cancelFriendRequest);
    this.router.patch(`${this.path}/:id/unfriend`, authMiddleware, this.friendsController.unfriend);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.friendsController.deleteFriendRequest);
  }
}

export default FriendsRoute;
