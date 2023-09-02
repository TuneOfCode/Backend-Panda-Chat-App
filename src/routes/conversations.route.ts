import ConversationsController from '@/controllers/conversations.controller';
import { IRoutes } from '@/interfaces/routes.interface';
import { Router } from 'express';

class ConversationsRoute implements IRoutes {
  public path = '/conversations';
  public router = Router();
  public conversationsController = new ConversationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {}
}

export default ConversationsRoute;
