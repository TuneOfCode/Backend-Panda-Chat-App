import NotificationsController from '@/controllers/notifications.controller';
import { IRoutes } from '@/interfaces/routes.interface';
import { Router } from 'express';

class NotificationsRoute implements IRoutes {
  public path = '/notifications';
  public router = Router();
  public notificationsController = new NotificationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {}
}

export default NotificationsRoute;
