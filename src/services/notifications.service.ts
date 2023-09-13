import { CreateNotificationDto, UpdateNotificationDto } from '@/dtos/notifications.dto';
import { HttpException } from '@/exceptions/HttpException';
import { INotification } from '@/interfaces/notifications.interface';
import { IParameter } from '@/interfaces/parameters.interface';
import notificationModel from '@/models/notifications.model';
import NotificationRepository from '@/repositories/notifation.repository';
import { isEmpty } from '@/utils/util';

class NotificationsService {
  private readonly notifications = notificationModel;
  private readonly notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  public async createNotification(notificationData: CreateNotificationDto): Promise<INotification> {
    if (isEmpty(notificationData)) throw new HttpException(400, 'Data is empty');

    const findNotification: INotification = await this.notifications.findOne({
      sender: notificationData.senderId,
      recipient: notificationData.recipientId,
      type: notificationData.type,
    });

    if (findNotification) return findNotification;

    const newNotification: INotification = await this.notifications.create({
      sender: notificationData.senderId,
      recipient: notificationData.recipientId,
      type: notificationData.type,
      content: notificationData.content,
      thumbnail: notificationData.thumbnail,
    });
    return newNotification;
  }

  public async findAllNotificationsOfMe(userId: string, params?: IParameter): Promise<INotification[]> {
    const type = params.filters.type;
    if (type) params.filters = { recipient: userId, type: type };
    else {
      params.filters = { recipient: userId };
    }
    const findNotifications: INotification[] = await this.notificationRepository.find(params);
    return findNotifications;
  }

  public async findNotificationById(notificationId: string): Promise<INotification> {
    const findNotification: INotification = await this.notificationRepository.findDetailNotification(notificationId);

    if (!findNotification) throw new HttpException(409, 'The notification is not exist');

    return findNotification;
  }

  public async updateNotification(notificationId: string, notificationData: UpdateNotificationDto): Promise<INotification> {
    if (isEmpty(notificationData)) throw new HttpException(400, 'Data is empty');

    const findNotification: INotification = await this.notifications.findById(notificationId);
    if (!findNotification) throw new HttpException(409, 'The notification is not exist');

    const updateNotificationById: INotification = await this.notifications.findByIdAndUpdate(
      notificationId,
      {
        sender: notificationData.senderId ?? findNotification.sender,
        recipient: notificationData.recipientId ?? findNotification.recipient,
        type: notificationData.type ?? findNotification.type,
        content: notificationData.content ?? findNotification.content,
        thumbnail: notificationData.thumbnail ?? findNotification.thumbnail,
      },
      { new: true },
    );
    return updateNotificationById;
  }

  public async readNotification(userId: string, notificationId: string, isReadAll: boolean = false): Promise<INotification[] | INotification> {
    const findNotification: INotification = await this.notifications.findOne({
      _id: notificationId,
      recipient: userId,
    });
    if (!findNotification) throw new HttpException(409, 'The notification is not exist');

    if (isReadAll) {
      const readAllNotification: INotification[] = await this.notifications.findOneAndUpdate(
        {
          _id: notificationId,
          recipient: userId,
        },
        {
          readedAt: new Date(),
        },
        { new: true, multi: true },
      );

      return readAllNotification;
    }

    const readNotificationById: INotification = await this.notifications.findByIdAndUpdate(
      notificationId,
      {
        readedAt: new Date(),
      },
      { new: true },
    );
    return readNotificationById;
  }

  public async deleteNotification(userId: string, notificationIds: string[]): Promise<INotification[]> {
    if (isEmpty(notificationIds) || !Array.isArray(notificationIds)) throw new HttpException(400, 'Data is empty or invalid');
    let findNotificationIsDeleted: INotification[] = [];

    for (const notificationId of notificationIds) {
      const findNotification: INotification = await this.notifications.findOne({
        _id: notificationId,
        recipient: userId,
      });
      // if (!findNotification) throw new HttpException(409, 'The notification is not exist');
      if (!findNotification) continue;

      const deleteNotification: INotification = await this.notifications.findByIdAndUpdate(
        notificationId,
        {
          deletedAt: new Date(),
        },
        { new: true },
      );

      if (deleteNotification) findNotificationIsDeleted.push(deleteNotification);
    }

    return findNotificationIsDeleted;
  }
}

export default NotificationsService;
