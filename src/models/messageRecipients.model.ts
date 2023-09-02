import { IMessageRecipient } from '@/interfaces/messageRecipients.interface';
import { Document, Schema, model } from 'mongoose';

const messageRecipientSchema: Schema = new Schema<IMessageRecipient>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      name: 'recipient',
    },
    message: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: true,
      name: 'message',
    },
    readedAt: {
      type: Date,
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

const messageRecipientModel = model<IMessageRecipient & Document>('MessageRecipient', messageRecipientSchema);
export default messageRecipientModel;
