import ConversationsService from '@/services/conversations.service';

class ConversationsController {
  private readonly conversationsService = new ConversationsService();
}

export default ConversationsController;
