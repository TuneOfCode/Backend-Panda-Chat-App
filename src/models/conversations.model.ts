import { ConversationType, IConversation } from '@/interfaces/conversations.interface';
import { Document, Schema, model } from 'mongoose';

const conversationSchema: Schema = new Schema<IConversation>(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
      enum: ConversationType,
      default: ConversationType.PRIVATE,
    },
    onwer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      name: 'onwer',
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        name: 'members',
      },
    ],
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

const conversationModel = model<IConversation & Document>('Conversation', conversationSchema);
export default conversationModel;
