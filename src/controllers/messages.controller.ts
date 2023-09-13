import { HOST_UPLOAD } from '@/config';
import { uploadConst } from '@/constants';
import { CreateMessageDto, UpdateMessageDto } from '@/dtos/messages.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { IMessageRecipient } from '@/interfaces/messageRecipients.interface';
import { IMessage } from '@/interfaces/messages.interface';
import MessagesService from '@/services/messages.service';
import { NextFunction, Response } from 'express';

class MessagesController {
  private readonly messagesService = new MessagesService();

  public createMessage = async (req: RequestWithUser | any, res: Response, next: NextFunction): Promise<void> => {
    try {
      let files: string[] = [];

      if (req.files) {
        files = req.files.map((file: Express.Multer.File) => {
          const folderUploadedFile = file.path.replace(uploadConst.SAVE_PLACES.ROOT, '');
          return `${HOST_UPLOAD}${folderUploadedFile}`;
        });
      }

      const userId: string = req.user._id.toString();
      const messageData: CreateMessageDto = {
        ...req.body,
        files,
      };

      const newMessage = await this.messagesService.createMessage(userId, messageData);

      res.status(201).json({ data: newMessage, message: 'Created message' });
    } catch (error) {
      next(error);
    }
  };

  public getAllMessagesIsNotReadedOfMe = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user._id.toString();
      const messages: IMessageRecipient[] = await this.messagesService.findAllMessagesIsNotReadedOfMe(userId);

      res.status(200).json({ data: messages, message: 'Find all messages is not readed of me' });
    } catch (error) {
      next(error);
    }
  };

  public getOneMessageByStatus = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messageId: string = req.params.id;
      const message: IMessage = await this.messagesService.findOneMessageByStatus(messageId);

      res.status(200).json({ data: message, message: 'Find one message by status' });
    } catch (error) {
      next(error);
    }
  };

  public updateMessage = async (req: RequestWithUser | any, res: Response, next: NextFunction): Promise<void> => {
    try {
      let files: string[] = [];

      if (req.files) {
        files = req.files.map((file: Express.Multer.File) => {
          const folderUploadedFile = file.path.replace(uploadConst.SAVE_PLACES.ROOT, '');
          return `${HOST_UPLOAD}${folderUploadedFile}`;
        });
      }

      const userId: string = req.user._id.toString();
      const messageData: UpdateMessageDto = {
        ...req.body,
        files,
        messageId: req.params.id,
      };
      const updateMessage: IMessage = await this.messagesService.updateMessage(userId, messageData);

      res.status(200).json({ data: updateMessage, message: 'Updated message' });
    } catch (error) {
      next(error);
    }
  };

  public readMessage = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user._id.toString();
      const messageId: string = req.params.id.toString();
      const readedMessage: IMessage = await this.messagesService.readMessage(userId, messageId);

      res.status(200).json({ data: readedMessage, message: 'Readed message' });
    } catch (error) {
      next(error);
    }
  };

  public recallMessage = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user._id.toString();
      const messageId: string = req.params.id.toString();
      const recallMessage: IMessage = await this.messagesService.recallMessage(userId, messageId);

      res.status(200).json({ data: recallMessage, message: 'Recalled message' });
    } catch (error) {
      next(error);
    }
  };

  public restoreMessage = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user._id.toString();
      const messageId: string = req.params.id.toString();
      const restoredMessage: IMessage = await this.messagesService.restoreMessage(userId, messageId);

      res.status(200).json({ data: restoredMessage, message: 'Restored message' });
    } catch (error) {
      next(error);
    }
  };

  public deleteMessage = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user._id.toString();
      const messageId: string = req.params.id.toString();
      const deletedMessage: IMessage = await this.messagesService.deleteMessage(userId, messageId);

      res.status(200).json({ data: deletedMessage, message: 'Deleted message' });
    } catch (error) {
      next(error);
    }
  };
}

export default MessagesController;
