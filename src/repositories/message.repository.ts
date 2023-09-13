import { IMessage } from '@/interfaces/messages.interface';
import messageModel from '@/models/messages.model';
import BaseRepository from './base.repository';
import { IParameter, SortType } from '@/interfaces/parameters.interface';
import mongoose from 'mongoose';

export default class MessageRepository extends BaseRepository<IMessage> {
  constructor() {
    super(messageModel);
  }

  public async findDetailMessage(messageId: string): Promise<IMessage> {
    return this.model
      .findOne({
        _id: messageId,
        recalledAt: null,
      })
      .populate([
        {
          path: 'conversation',
          select: '_id name type',
        },
        {
          path: 'messageRecipients',
          populate: {
            path: 'recipient',
            select: '_id firstName lastName avatar',
          },
          select: '_id recipient readedAt',
          options: { sort: { readedAt: SortType.DESC } },
        },
      ]);
  }

  public async findOneMessageIsNotReaded(messageId: string): Promise<IMessage> {
    return this.model
      .findOne({
        _id: messageId,
        recalledAt: null,
      })
      .populate([
        {
          path: 'conversation',
          select: '_id name type',
        },
        {
          path: 'messageRecipients',
          populate: {
            path: 'recipient',
            select: '_id firstName lastName avatar',
          },
          match: { readedAt: { $eq: null } },
          select: '_id recipient readedAt',
        },
      ]);
  }

  public async findAllMessagesInConversation(params?: IParameter): Promise<IMessage[]> {
    const sortField = params?.sort?.sort_field || 'createdAt';
    const sortType = params?.sort?.sort_type || SortType.DESC;
    const page = Number(params?.paginate?.page) || 1;
    const perPage = Number(params?.paginate?.per_page) || 10;

    return await this.model
      .find(params.filters)
      .sort({ [sortField]: sortType || SortType.DESC })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate([
        {
          path: 'messageRecipients',
          populate: {
            path: 'recipient',
            select: '_id firstName lastName avatar',
          },
          select: '_id recipient readedAt',
          options: { sort: { readedAt: SortType.DESC } },
        },
      ])
      .exec();
  }

  public async findLastMessageInConversation(conversationId: string): Promise<IMessage> {
    return this.model
      .findOne({
        conversation: conversationId,
        // recalledAt: null, // // if recalledAt is not null then show message: 'Tin nhắn đã bị thu hồi'
      })
      .sort({ createdAt: SortType.DESC })
      .populate([
        {
          path: 'messageRecipients',
          populate: {
            path: 'recipient',
            select: '_id firstName lastName avatar',
          },
          select: '_id recipient readedAt',
        },
      ]);
  }

  public async findAllMessagesBeforeLastMessageInConversation(conversationId: string): Promise<IMessage[]> {
    const lastMessage: IMessage = await this.findLastMessageInConversation(conversationId);
    const lastMessageObjectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(lastMessage._id.toString());
    return this.model
      .find({
        conversation: conversationId,
        recalledAt: null,
        createdAt: { $lt: lastMessageObjectId._id.getTimestamp() },
      })
      .sort({ createdAt: SortType.DESC })
      .populate([
        {
          path: 'messageRecipients',
          populate: {
            path: 'recipient',
            select: '_id firstName lastName avatar',
          },
          select: '_id recipient readedAt',
        },
      ]);
  }
}
