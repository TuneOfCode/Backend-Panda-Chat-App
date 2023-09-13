import NotificationsController from '@/controllers/notifications.controller';
import { CreateNotificationDto, UpdateNotificationDto } from '@/dtos/notifications.dto';
import { IRoutes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import queryMiddleware from '@/middlewares/query.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';

class NotificationsRoute implements IRoutes {
  public path = '/notifications';
  public router = Router();
  public notificationsController = new NotificationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, queryMiddleware, this.notificationsController.getNotificationsOfMe);

    this.router.get(`${this.path}/:id`, authMiddleware, this.notificationsController.getNotificationById);

    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateNotificationDto, 'body'),
      this.notificationsController.createNotification,
    );

    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(UpdateNotificationDto, 'body'),
      this.notificationsController.updateNotification,
    );

    this.router.patch(`${this.path}/:id/read`, authMiddleware, this.notificationsController.readNotification);

    this.router.delete(`${this.path}/:id`, authMiddleware, this.notificationsController.deleteNotification);
  }
}

export default NotificationsRoute;
