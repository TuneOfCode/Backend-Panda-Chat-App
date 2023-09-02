import { IRole } from '@/interfaces/roles.interface';
import { Document, Schema, model } from 'mongoose';

const roleSchema: Schema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        name: 'users',
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

const roleModel = model<IRole & Document>('Role', roleSchema);

export default roleModel;
