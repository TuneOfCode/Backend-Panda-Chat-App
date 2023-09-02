import MessagesController from '@/controllers/messages.controller';
import { IRoutes } from '@/interfaces/routes.interface';
import { Router } from 'express';

class MessagesRoute implements IRoutes {
  public path = '/messages';
  public router = Router();
  public messagesController = new MessagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {}
}

export default MessagesRoute;
