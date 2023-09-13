import { IMessage } from '@/interfaces/messages.interface';
import { Document, Schema, model } from 'mongoose';

const messageSchema: Schema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      name: 'sender',
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      name: 'conversation',
    },
    text: {
      type: String,
      required: false,
      default: null,
    },
    files: [
      {
        type: String,
        required: false,
        default: null,
      },
    ],
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: false,
      name: 'replyTo',
      default: null,
    },
    messageRecipients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'MessageRecipient',
        required: false,
        name: 'messageRecipients',
      },
    ],
    recalledAt: {
      type: Schema.Types.Date,
      required: false,
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

const messageModel = model<IMessage & Document>('Message', messageSchema);
export default messageModel;
