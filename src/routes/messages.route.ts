import { uploadConst } from '@/constants';
import MessagesController from '@/controllers/messages.controller';
import { CreateMessageDto, UpdateMessageDto } from '@/dtos/messages.dto';
import { IRoutes } from '@/interfaces/routes.interface';
import { UploadExtType } from '@/interfaces/upload.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import queryMiddleware from '@/middlewares/query.middleware';
import uploadMiddleware from '@/middlewares/upload.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';

class MessagesRoute implements IRoutes {
  public path = '/messages';
  public router = Router();
  public messagesController = new MessagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      uploadMiddleware({
        allowedExtType: UploadExtType.ALL,
      }).array(uploadConst.FIELD_NAME.FILES),
      validationMiddleware(CreateMessageDto, 'body'),
      this.messagesController.createMessage,
    );

    this.router.get(`${this.path}`, authMiddleware, queryMiddleware, this.messagesController.getAllMessagesIsNotReadedOfMe);

    this.router.get(`${this.path}/:id`, authMiddleware, this.messagesController.getOneMessageByStatus);

    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      uploadMiddleware({
        allowedExtType: UploadExtType.ALL,
      }).array(uploadConst.FIELD_NAME.FILES),
      validationMiddleware(UpdateMessageDto, 'body'),
      this.messagesController.updateMessage,
    );

    this.router.patch(`${this.path}/:id/read`, authMiddleware, this.messagesController.readMessage);

    this.router.patch(`${this.path}/:id/recall`, authMiddleware, this.messagesController.recallMessage);

    this.router.patch(`${this.path}/:id/restore`, authMiddleware, this.messagesController.restoreMessage);

    this.router.delete(`${this.path}/:id`, authMiddleware, this.messagesController.deleteMessage);
  }
}

export default MessagesRoute;
