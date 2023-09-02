import FriendsController from '@/controllers/friends.controller';
import { IRoutes } from '@/interfaces/routes.interface';
import { Router } from 'express';

class FriendsRoute implements IRoutes {
  public path = '/friends';
  public router = Router();
  public friendsController = new FriendsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {}
}

export default FriendsRoute;
