import { IConversation } from '@/interfaces/conversations.interface';
import conversationModel from '@/models/conversations.model';
import BaseRepository from './base.repository';

export default class ConversationRepository extends BaseRepository<IConversation> {
  constructor() {
    super(conversationModel);
  }
}
