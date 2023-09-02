import MessagesService from '@/services/messages.service';

class MessagesController {
  private readonly messagesService = new MessagesService();
}

export default MessagesController;
