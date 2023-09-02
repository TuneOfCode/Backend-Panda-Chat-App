import { INotification } from '@/interfaces/notifications.interface';
import notificationModel from '@/models/notifications.model';
import BaseRepository from './base.repository';

export default class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(notificationModel);
  }
}
