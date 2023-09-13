import { HOST_UPLOAD } from '@/config';
import { uploadConst } from '@/constants';
import { CreateConversationDto, UpdateConversationDto } from '@/dtos/conversations.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { IConversation } from '@/interfaces/conversations.interface';
import { IMessage } from '@/interfaces/messages.interface';
import { IParameter, RequestWithQuery } from '@/interfaces/parameters.interface';
import ConversationsService from '@/services/conversations.service';
import { NextFunction, Response } from 'express';
import fs from 'fs';

class ConversationsController {
  private readonly conversationsService = new ConversationsService();

  public createConversation = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      let avatar = null;
      if (req.file) {
        const folderUploadedFile = req.file.path.replace(uploadConst.SAVE_PLACES.ROOT, '');
        avatar = `${HOST_UPLOAD}${folderUploadedFile}`;
      }

      const userId: string = req.user._id.toString();
      const conversationData: CreateConversationDto = {
        ...req.body,
        avatar,
        memberIds: req.body.memberIds.trim().replace(/\s+/g, '').split(','),
      };
      console.log('==> conversationData:::', conversationData);
      const newConversation: IConversation = await this.conversationsService.createConversationTypeGroup(userId, conversationData);

      res.status(201).json({ data: newConversation, message: 'Created conversation type group' });
    } catch (error) {
      // remove path file when error
      if (req.path && fs.existsSync(req.path)) {
        fs.unlinkSync(req.path);
      }
      next(error);
    }
  };

  public getAllConversationsOfMe = async (req: RequestWithUser & RequestWithQuery, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const params: IParameter = {
        filters: {
          search: req.query.search,
          type: req.query.type,
        },
        ...req.queryParams,
      };

      const conversations: IConversation[] = await this.conversationsService.findAllConversationsOfMe(userId, params);

      res.status(200).json({ data: conversations, message: 'Find all convertions of me' });
    } catch (error) {
      next(error);
    }
  };

  public getLastMessageInConversation = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const conversationId: string = req.params.id;
      const lastMessage: IMessage = await this.conversationsService.findLastMessageInConversation(conversationId);

      res.status(200).json({ data: lastMessage, message: 'Find last message in conversation' });
    } catch (error) {
      next(error);
    }
  };

  public getConversationById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const conversationId: string = req.params.id;
      const conversation: IConversation = await this.conversationsService.findConversationById(conversationId);

      res.status(200).json({ data: conversation, message: 'Find detail of a conversation' });
    } catch (error) {
      next(error);
    }
  };

  public getAllMessagesById = async (req: RequestWithUser & RequestWithQuery, res: Response, next: NextFunction) => {
    try {
      const conversationId: string = req.params.id;
      const params: IParameter = {
        filters: {
          search: req.query.search,
        },
        ...req.queryParams,
      };

      const messages: IMessage[] = await this.conversationsService.findAllMessagesInConversation(conversationId, params);
      res.status(200).json({ data: messages, message: 'Find all messages in conversation' });
    } catch (error) {
      next(error);
    }
  };

  public updateConversationById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      let avatar = null;
      if (req.file) {
        const folderUploadedFile = req.file.path.replace(uploadConst.SAVE_PLACES.ROOT, '');
        avatar = `${HOST_UPLOAD}${folderUploadedFile}`;
      }

      const conversationId: string = req.params.id;
      const conversationData: UpdateConversationDto = {
        ...req.body,
        avatar,
      };
      const updateConversation: IConversation = await this.conversationsService.updateConversation(conversationId, conversationData);

      res.status(200).json({ data: updateConversation, message: 'Updated conversation' });
    } catch (error) {
      // remove path file when error
      if (req.path && fs.existsSync(req.path)) {
        fs.unlinkSync(req.path);
      }
      next(error);
    }
  };

  public addMembers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const conversationId: string = req.params.id;
      const memberIds: string[] = req.body.memberIds;
      const addMembers: IConversation = await this.conversationsService.addMembersToConversation(userId, conversationId, memberIds);

      res.status(200).json({ data: addMembers, message: 'Added members to conversation' });
    } catch (error) {
      next(error);
    }
  };

  public kickMembers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const conversationId: string = req.params.id;
      const memberIds: string[] = req.body.memberIds;
      const kickMembers: IConversation = await this.conversationsService.kickMembersFromConversation(userId, conversationId, memberIds);

      res.status(200).json({ data: kickMembers, message: 'Kicked members from conversation' });
    } catch (error) {
      next(error);
    }
  };

  public leaveConversation = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const conversationId: string = req.params.id;
      const leaveConversation: IConversation = await this.conversationsService.leaveConversation(userId, conversationId);

      res.status(200).json({ data: leaveConversation, message: 'Leave conversation' });
    } catch (error) {
      next(error);
    }
  };

  public deleteConversationById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const conversationId: string = req.params.id;
      const deleteConversation: IConversation = await this.conversationsService.deleteConversation(userId, conversationId);

      res.status(200).json({ data: deleteConversation, message: 'Deleted conversation' });
    } catch (error) {
      next(error);
    }
  };
}

export default ConversationsController;
