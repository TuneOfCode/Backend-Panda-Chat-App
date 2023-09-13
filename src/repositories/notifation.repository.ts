import { INotification } from '@/interfaces/notifications.interface';
import notificationModel from '@/models/notifications.model';
import BaseRepository from './base.repository';

export default class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(notificationModel);
  }

  public async findDetailNotification(notificationId: string): Promise<INotification> {
    const findNotification: INotification = await this.model
      .findById(notificationId)
      .populate({ path: 'sender', select: '_id email username firstName lastName avatar' })
      .populate({ path: 'recipient', select: '_id email username firstName lastName avatar' });
    return findNotification;
  }
}
