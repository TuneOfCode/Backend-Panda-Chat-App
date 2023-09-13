import { CreateMessageDto, CreateMessageRecipientDto, UpdateMessageDto } from '@/dtos/messages.dto';
import { HttpException } from '@/exceptions/HttpException';
import { ConversationType, IConversation } from '@/interfaces/conversations.interface';
import { IMessageRecipient } from '@/interfaces/messageRecipients.interface';
import { IMessage } from '@/interfaces/messages.interface';
import conversationModel from '@/models/conversations.model';
import messageRecipientModel from '@/models/messageRecipients.model';
import messageModel from '@/models/messages.model';
import ConversationRepository from '@/repositories/conversation.repository';
import MessageRepository from '@/repositories/message.repository';
import MessageRecipientRepository from '@/repositories/messageRecipient.repository';
import { isEmpty, isMongoObjectId } from '@/utils/util';
import NotificationsService from './notifications.service';
import notificationModel from '@/models/notifications.model';
import { CreateNotificationDto } from '@/dtos/notifications.dto';
import { INotification, NotificationType } from '@/interfaces/notifications.interface';
import { send } from 'process';
import { IUser } from '@/interfaces/users.interface';
import userModel from '@/models/users.model';

class MessagesService {
  private readonly messages = messageModel;
  private readonly messageRecipients = messageRecipientModel;
  private readonly conversations = conversationModel;
  private readonly users = userModel;
  private readonly notifications = notificationModel;
  private readonly messageRepository: MessageRepository;
  private readonly messageRecipientRepository: MessageRecipientRepository;
  private readonly conversationRepository: ConversationRepository;
  private readonly notificationService: NotificationsService;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.messageRecipientRepository = new MessageRecipientRepository();
    this.conversationRepository = new ConversationRepository();
    this.notificationService = new NotificationsService();
  }

  public async createMessage(userId: string, messageData: CreateMessageDto): Promise<IMessage> {
    if (isEmpty(messageData)) throw new HttpException(400, 'Data is empty');

    messageData.senderId = userId;

    const findConversation: IConversation = await this.conversations.findOne({
      _id: messageData.conversationId,
      $or: [{ members: { $in: [userId] } }, { onwer: userId }],
    });

    if (!findConversation) throw new HttpException(409, 'Conversation not found');

    if (isEmpty(messageData.text) && isEmpty(messageData.files)) throw new HttpException(400, 'Message content is empty');

    const newMessage: IMessage = await this.messages.create({
      sender: messageData.senderId,
      conversation: messageData.conversationId,
      text: messageData.text,
      files: messageData.files,
      parent: isMongoObjectId(messageData.parentMessageId) ? messageData.parentMessageId : null,
    });

    if (newMessage) {
      // add members of conversation to message recipients
      const memberIds: string[] = findConversation.members.map(member => member.toString());
      for (const memberId of memberIds) {
        if (memberId === userId) continue;
        const newMessageRecipients: IMessageRecipient = await this.messageRecipients.create({
          recipient: memberId,
          message: newMessage._id,
        });

        if (newMessageRecipients) {
          await this.messages.findByIdAndUpdate(newMessage._id, {
            $push: { messageRecipients: newMessageRecipients._id },
          });
        }

        // send notification message is not read to members of conversation
        const findSender: IUser = await this.users.findById(userId);
        let conversationName: string = null;
        let conversationAvatar: string = null;
        if (findConversation.type === ConversationType.GROUP) {
          conversationName = findConversation.name;
          conversationAvatar = findConversation.avatar;
        }

        if (findConversation.type === ConversationType.PRIVATE) {
          const findMember: IUser = findConversation.members.find(member => member._id.toString() === memberId);
          conversationName = `${findMember.firstName} ${findMember.lastName}`;
          conversationAvatar = findMember.avatar;
        }

        const notificationData: CreateNotificationDto = {
          senderId: userId,
          recipientId: memberId,
          type: NotificationType.MESSAGE,
          content: `${findSender.firstName} ${findSender.lastName} đã gửi tin nhắn mới cho bạn trong cuộc trò chuyện ${conversationName}`,
          thumbnail: conversationAvatar,
        };

        await this.notificationService.createNotification(notificationData);

        // TODO: send message to socket
      }
    }

    return newMessage;
  }

  public async findAllMessagesIsNotReadedOfMe(userId: string): Promise<IMessageRecipient[]> {
    const findMessageRecipients: IMessageRecipient[] = await this.messageRecipientRepository.findAllMessagesIsNotReadedOfMe(userId);

    return findMessageRecipients;
  }

  public async findOneMessageByStatus(messageId: string): Promise<IMessage> {
    const findMessage: IMessage = await this.messages.findOne({ _id: messageId });
    if (!findMessage) throw new HttpException(409, 'Message not found');

    return await this.messageRepository.findDetailMessage(messageId);
  }

  public async updateMessage(userId: string, messageData: UpdateMessageDto): Promise<IMessage> {
    if (isEmpty(messageData)) throw new HttpException(400, 'Data is empty');

    const findMessage: IMessage = await this.messages.findOne({ _id: messageData.messageId, sender: userId });

    if (!findMessage) throw new HttpException(409, 'Message not found');

    if (isEmpty(messageData.text) && isEmpty(messageData.files)) throw new HttpException(400, 'Message content is empty');

    const editMessage: IMessage = await this.messages.findByIdAndUpdate(messageData.messageId, {
      text: messageData.text ?? findMessage.text,
      files: messageData.files ?? findMessage.files,
      parent: isMongoObjectId(messageData.parentMessageId) ? messageData.parentMessageId : findMessage.parent,
    });

    return editMessage;
  }

  public async readMessage(userId: string, messageId: string): Promise<IMessage> {
    const findMessage: IMessage = await this.messages.findById(messageId);
    if (!findMessage) throw new HttpException(409, 'Message not found');

    const findAllMessagesBeforeLastMessage: IMessage[] = await this.messageRepository.findAllMessagesBeforeLastMessageInConversation(
      findMessage.conversation._id.toString(),
    );

    console.log('==> findAllMessagesBeforeLastMessage:::', findAllMessagesBeforeLastMessage);

    if (findAllMessagesBeforeLastMessage.length > 0) {
      for (const message of findAllMessagesBeforeLastMessage) {
        // update readedAt of userId before last message
        await this.messageRecipients.findOneAndUpdate(
          {
            recipient: userId,
            message: message._id,
          },
          {
            readedAt: new Date(),
          },
        );

        // // can delte message recipients before last message of userId
        // await this.messageRecipients.findOneAndDelete({
        //   recipient: userId,
        //   message: message._id,
        // });
      }
    }

    const findMessageRecipient: IMessageRecipient = await this.messageRecipients.findOne({
      recipient: userId,
      message: messageId,
      readedAt: null,
    });

    if (findMessageRecipient) {
      await this.messageRecipients.findByIdAndUpdate(findMessageRecipient._id, { readedAt: new Date() });

      // update notification
      await this.notifications.findOneAndUpdate(
        {
          sender: findMessage.sender._id.toString(),
          recipient: userId,
          type: NotificationType.MESSAGE,
        },
        {
          $set: { readedAt: new Date() },
        },
        { new: true, multi: true },
      );

      // // Delete notification
      // await this.notifications.findOneAndDelete({
      //   sender: findMessage.sender._id.toString(),
      //   recipient: userId,
      //   type: NotificationType.MESSAGE,
      //   readedAt: { $ne: null },
      // });
    }

    const readMessage: IMessage = await this.messageRepository.findDetailMessage(messageId);

    return readMessage;
  }

  public async recallMessage(userId: string, messageId: string): Promise<IMessage> {
    const findMessage: IMessage = await this.messages.findOne({ _id: messageId, sender: userId });

    if (!findMessage) throw new HttpException(409, 'Message not found');

    const recallMessage: IMessage = await this.messages.findByIdAndUpdate(messageId, {
      $set: { recalledAt: new Date() },
    });

    return recallMessage;
  }

  public async restoreMessage(userId: string, messageId: string): Promise<IMessage> {
    const findMessage: IMessage = await this.messages.findOne({ _id: messageId, sender: userId });

    if (!findMessage) throw new HttpException(409, 'Message not found');

    const restoreMessage: IMessage = await this.messages.findByIdAndUpdate(messageId, {
      $set: { recalledAt: null },
    });

    return restoreMessage;
  }

  public async deleteMessage(userId: string, messageId: string): Promise<IMessage> {
    const findMessage: IMessage = await this.messages.findOne({ _id: messageId, sender: userId });

    if (!findMessage) throw new HttpException(409, 'Message not found');

    const deleteMessage: IMessage = await this.messages.findByIdAndDelete(messageId);

    if (deleteMessage) {
      // delete message recipients
      for (const messageRecipientId of deleteMessage.messageRecipients) {
        await this.messageRecipients.findByIdAndDelete(messageRecipientId);
      }

      // update child messages
      const findChildMessages: IMessage[] = await this.messages.find({ parent: messageId });
      for (const childMessage of findChildMessages) {
        await this.messages.findByIdAndUpdate(childMessage._id, { parent: null });
      }
    }

    return deleteMessage;
  }
}

export default MessagesService;
