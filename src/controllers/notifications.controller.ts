import { CreateNotificationDto, UpdateNotificationDto } from '@/dtos/notifications.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { IParameter, RequestWithQuery } from '@/interfaces/parameters.interface';
import NotificationsService from '@/services/notifications.service';
import { NextFunction, Request, Response } from 'express';

class NotificationsController {
  private readonly notificationsService = new NotificationsService();

  public createNotification = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user._id.toString();
      const notificationData: CreateNotificationDto = {
        ...req.body,
        senderId: userId,
      };
      const createNotificationData = await this.notificationsService.createNotification(notificationData);

      res.status(201).json({ data: createNotificationData, message: 'Created notification' });
    } catch (error) {
      next(error);
    }
  };

  public getNotificationsOfMe = async (req: RequestWithUser & RequestWithQuery, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user._id.toString();
      const params: IParameter = {
        ...req.queryParams,
        filters: {
          type: req.query.type,
        },
      };
      const notificationsData = await this.notificationsService.findAllNotificationsOfMe(userId, params);

      res.status(200).json({ data: notificationsData, message: 'Find all notifications of me' });
    } catch (error) {
      next(error);
    }
  };

  public getNotificationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notificationId: string = req.params.id;
      const notificationData = await this.notificationsService.findNotificationById(notificationId);

      res.status(200).json({ data: notificationData, message: 'Find notification by id' });
    } catch (error) {
      next(error);
    }
  };

  public updateNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notificationId: string = req.params.id;
      const notificationData: UpdateNotificationDto = req.body;
      const updateNotificationData = await this.notificationsService.updateNotification(notificationId, notificationData);

      res.status(200).json({ data: updateNotificationData, message: 'Updated notification' });
    } catch (error) {
      next(error);
    }
  };

  public readNotification = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user._id.toString();
      const notificationId: string = req.params.id;
      const isReadAll: boolean = req.query.isReadAll ? true : false;
      const readNotificationData = await this.notificationsService.readNotification(userId, notificationId, isReadAll);

      res.status(200).json({ data: readNotificationData, message: 'Readed notification' });
    } catch (error) {
      next(error);
    }
  };

  public deleteNotification = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user._id.toString();
      const notificationIds: string[] = req.body.ids;
      const deleteNotificationData = await this.notificationsService.deleteNotification(userId, notificationIds);

      res.status(200).json({ data: deleteNotificationData, message: 'Deleted notification' });
    } catch (error) {
      next(error);
    }
  };
}

export default NotificationsController;
