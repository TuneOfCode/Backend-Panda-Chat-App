import { model, Schema, Document } from 'mongoose';
import { IUser } from '@interfaces/users.interface';

export const userSchema: Schema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: false,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      require: false,
    },
    address: {
      type: String,
      require: false,
    },
    // verifiedEmail: {
    //   type: Boolean,
    //   require: false,
    //   default: false,
    // },
    refreshToken: {
      type: String,
      require: false,
    },
    offlineAt: {
      type: Schema.Types.Date,
      required: false,
      default: null,
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: false,
        name: 'roles',
      },
    ],
    conversations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: false,
        name: 'conversations',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        name: 'friends',
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

const userModel = model<IUser & Document>('User', userSchema);

export default userModel;
