import conversationModel from '@/models/conversations.model';
import ConversationRepository from '@/repositories/conversation.repository';

class ConversationsService {
  private readonly conversations = conversationModel;
  private readonly conversationRepository: ConversationRepository;

  constructor() {
    this.conversationRepository = new ConversationRepository();
  }
}

export default ConversationsService;
