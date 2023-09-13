import { INotification, NotificationType } from '@/interfaces/notifications.interface';
import { Document, Schema, model } from 'mongoose';

const notificationSchema: Schema = new Schema<INotification>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      name: 'sender',
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      name: 'recipient',
    },
    type: {
      type: String,
      required: true,
      enum: NotificationType,
      default: NotificationType.SYSTEM,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    readedAt: {
      type: Schema.Types.Date,
      required: false,
      default: null,
    },
    deletedAt: {
      type: Schema.Types.Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const notificationModel = model<INotification & Document>('Notification', notificationSchema);
export default notificationModel;
