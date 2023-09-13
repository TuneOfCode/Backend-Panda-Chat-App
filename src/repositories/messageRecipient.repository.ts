import { IMessageRecipient } from '@/interfaces/messageRecipients.interface';
import messageRecipientModel from '@/models/messageRecipients.model';
import BaseRepository from './base.repository';

export default class MessageRecipientRepository extends BaseRepository<IMessageRecipient> {
  constructor() {
    super(messageRecipientModel);
  }

  public async findAllMessagesIsNotReadedOfMe(userId: string) {
    return await this.model
      .find({
        recipient: userId,
        readedAt: null,
      })
      .populate([
        {
          path: 'message',
          populate: [
            {
              path: 'sender',
              select: '_id firstName lastName avatar',
            },
            {
              path: 'conversation',
              select: '_id name type',
            },
            {
              path: 'parent',
              select: '_id sender text files createdAt',
            },
          ],
          select: '_id sender text files createdAt',
        },
      ])
      .sort({ createdAt: -1 });
  }
}
