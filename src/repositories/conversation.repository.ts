import { IConversation } from '@/interfaces/conversations.interface';
import conversationModel from '@/models/conversations.model';
import BaseRepository from './base.repository';

export default class ConversationRepository extends BaseRepository<IConversation> {
  constructor() {
    super(conversationModel);
  }

  public async findConversationWithRelationships(id: string): Promise<IConversation> {
    return this.model
      .findById(id)
      .populate([
        {
          path: 'onwer',
          select: ['_id', 'firstName', 'lastName', 'username', 'email', 'avatar'],
        },
        {
          path: 'members',
          select: ['_id', 'firstName', 'lastName', 'username', 'email', 'avatar'],
        },
        // {
        //   path: 'messages',
        //   populate: [
        //     {
        //       path: 'sender',
        //       select: ['_id', 'firstName', 'lastName', 'username', 'email', 'avatar'],
        //     },
        //   ],
        // }
      ])
      .exec();
  }
}
