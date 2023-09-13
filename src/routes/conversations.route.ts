import { uploadConst } from '@/constants';
import ConversationsController from '@/controllers/conversations.controller';
import { CreateConversationDto, UpdateConversationDto } from '@/dtos/conversations.dto';
import { IRoutes } from '@/interfaces/routes.interface';
import { UploadExtType } from '@/interfaces/upload.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import queryMiddleware from '@/middlewares/query.middleware';
import uploadMiddleware from '@/middlewares/upload.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';

class ConversationsRoute implements IRoutes {
  public path = '/conversations';
  public router = Router();
  public conversationsController = new ConversationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      uploadMiddleware({
        allowedExtType: UploadExtType.IMAGE,
      }).single(uploadConst.FIELD_NAME.AVATAR),
      validationMiddleware(CreateConversationDto, 'body'),
      this.conversationsController.createConversation,
    );

    this.router.get(`${this.path}`, authMiddleware, queryMiddleware, this.conversationsController.getAllConversationsOfMe);

    this.router.get(`${this.path}/:id`, authMiddleware, this.conversationsController.getConversationById);

    this.router.get(`${this.path}/:id/messages`, authMiddleware, queryMiddleware, this.conversationsController.getAllMessagesById);

    this.router.get(`${this.path}/:id/last-message`, authMiddleware, this.conversationsController.getLastMessageInConversation);

    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      uploadMiddleware({
        allowedExtType: UploadExtType.IMAGE,
      }).single(uploadConst.FIELD_NAME.AVATAR),
      validationMiddleware(UpdateConversationDto, 'body'),
      this.conversationsController.updateConversationById,
    );

    this.router.patch(`${this.path}/:id/messages`, authMiddleware, queryMiddleware, this.conversationsController.getAllMessagesById);

    this.router.patch(`${this.path}/:id/add-members`, authMiddleware, this.conversationsController.addMembers);

    this.router.patch(`${this.path}/:id/kick-members`, authMiddleware, this.conversationsController.kickMembers);

    this.router.patch(`${this.path}/:id/leave`, authMiddleware, this.conversationsController.leaveConversation);

    this.router.delete(`${this.path}/:id`, authMiddleware, this.conversationsController.deleteConversationById);
  }
}

export default ConversationsRoute;
