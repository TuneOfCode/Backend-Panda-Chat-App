import { FriendStatus, IFriend } from '@/interfaces/friends.interface';
import { Document, Schema, model } from 'mongoose';

const friendSchema: Schema = new Schema<IFriend>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      name: 'sender',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      name: 'receiver',
    },
    status: {
      type: String,
      required: true,
      enum: FriendStatus,
      default: FriendStatus.PENDING,
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

const friendModel = model<IFriend & Document>('Friend', friendSchema);
export default friendModel;
