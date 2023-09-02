import messageModel from '@/models/messages.model';
import MessageRepository from '@/repositories/message.repository';

class MessagesService {
  private readonly messages = messageModel;
  private readonly messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }
}

export default MessagesService;
