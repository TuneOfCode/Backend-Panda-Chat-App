import notificationModel from '@/models/notifications.model';
import NotificationRepository from '@/repositories/notifation.repository';

class NotificationsService {
  private readonly notifications = notificationModel;
  private readonly notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }
}

export default NotificationsService;
