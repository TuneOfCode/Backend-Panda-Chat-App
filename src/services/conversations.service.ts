import { CreateConversationDto, CreateConversationTypePrivateDto, UpdateConversationDto } from '@/dtos/conversations.dto';
import { HttpException } from '@/exceptions/HttpException';
import { ConversationType, IConversation } from '@/interfaces/conversations.interface';
import { IMessage } from '@/interfaces/messages.interface';
import { IParameter } from '@/interfaces/parameters.interface';
import { IUser } from '@/interfaces/users.interface';
import conversationModel from '@/models/conversations.model';
import messageModel from '@/models/messages.model';
import userModel from '@/models/users.model';
import ConversationRepository from '@/repositories/conversation.repository';
import MessageRepository from '@/repositories/message.repository';
import UserRepository from '@/repositories/user.repository';
import { isEmpty } from '@/utils/util';

class ConversationsService {
  private readonly conversations = conversationModel;
  private readonly users = userModel;
  private readonly messages = messageModel;
  private readonly conversationRepository: ConversationRepository;
  private readonly userRepository: UserRepository;
  private readonly messageRepository: MessageRepository;

  constructor() {
    this.conversationRepository = new ConversationRepository();
    this.userRepository = new UserRepository();
    this.messageRepository = new MessageRepository();
  }

  public async createConversationTypePrivate(userId: string, conversationData: CreateConversationTypePrivateDto): Promise<IConversation> {
    if (isEmpty(conversationData)) throw new HttpException(400, 'Data is empty');

    conversationData.ownerId = userId;
    const findConversation: IConversation = await this.conversations.findOne({
      type: ConversationType.PRIVATE,
      members: { $all: [conversationData.ownerId, conversationData.memberIds] },
      onwer: conversationData.ownerId,
    });

    // if (findConversation) throw new HttpException(409, 'Conversation already exists');
    if (findConversation) return findConversation;

    conversationData.memberIds.push(conversationData.ownerId);

    if (conversationData.memberIds.length > 2) {
      throw new HttpException(400, 'Maximum number of members is 2 because this is a private conversation');
    }

    const newConversation: IConversation = await this.conversations.create({
      name: conversationData.name,
      onwer: conversationData.ownerId,
      members: conversationData.memberIds,
      type: ConversationType.PRIVATE,
      avatar: conversationData.avatar,
    });

    if (newConversation) {
      // update user's conversations of owner and member
      for (const memberId of newConversation.members) {
        console.log(`===> Update user's conversations of owner and member::: ${memberId}`);
        await this.users.findByIdAndUpdate(
          memberId,
          {
            $addToSet: {
              conversations: newConversation._id.toString(),
            },
          },
          { new: true },
        );
      }
    }

    return newConversation;
  }

  public async createConversationTypeGroup(userId: string, conversationData: CreateConversationDto): Promise<IConversation> {
    if (isEmpty(conversationData)) throw new HttpException(400, 'Data is empty');

    conversationData.ownerId = userId;
    conversationData.memberIds.push(conversationData.ownerId);

    const newConversation: IConversation = await this.conversations.create({
      name: conversationData.name,
      onwer: conversationData.ownerId,
      members: conversationData.memberIds,
      type: ConversationType.GROUP,
      avatar: conversationData.avatar,
    });

    if (newConversation) {
      // update user's conversations of owner and member
      for (const memberId of conversationData.memberIds) {
        await this.users.findByIdAndUpdate(memberId, {
          $addToSet: {
            conversations: newConversation._id,
          },
        });
      }

      // create new notification via socket
    }

    return newConversation;
  }

  public async findAllConversationsOfMe(userId: string, params?: IParameter): Promise<IConversation[]> {
    let filters = {
      $or: [{ members: { $in: [userId] } }, { onwer: userId }],
      deletedAt: null,
      name: !isEmpty(params?.filters?.search) ? { $regex: params?.filters?.search.toString().toLowerCase(), $options: 'i' } : null,
      type: !isEmpty(params?.filters?.type) ? params?.filters?.type.toString().toLowerCase() : null,
    };

    if (isEmpty(filters.name)) delete filters.name;
    if (isEmpty(filters.type)) delete filters.type;
    params.filters = filters;

    const findConversations: IConversation[] = await this.conversationRepository.find(params);
    return findConversations;
  }

  public async findAllConversationsIsSoftDeletedOfMe(userId: string, params: IParameter): Promise<IConversation[]> {
    const findConversations: IConversation[] = await this.conversationRepository.find(params);
    return findConversations;
  }

  public async findAllMessagesInConversation(conversationId: string, params?: IParameter): Promise<IMessage[]> {
    let filters = {
      conversation: conversationId,
      // recalledAt: null, // if recalledAt is not null then show message: 'Tin nhắn đã bị thu hồi'
      text: null,
    };

    if (!isEmpty(params.filters?.search)) {
      filters = {
        ...filters,
        text: { $regex: params.filters?.search, $options: 'i' },
      };
    } else {
      delete filters.text;
    }

    params.filters = filters;

    return await this.messageRepository.findAllMessagesInConversation(params);
  }

  public async findLastMessageInConversation(conversationId: string): Promise<IMessage> {
    const lastMessage: IMessage = await this.messageRepository.findLastMessageInConversation(conversationId);

    if (!lastMessage) throw new HttpException(409, 'Message not found');

    return lastMessage;
  }

  public async findConversationById(conversationId: string): Promise<IConversation> {
    const findConversation: IConversation = await this.conversationRepository.findConversationWithRelationships(conversationId);

    if (!findConversation) throw new HttpException(409, 'Conversation not found');
    return findConversation;
  }

  public async updateConversation(conversationId: string, conversationData: UpdateConversationDto): Promise<IConversation> {
    if (isEmpty(conversationData)) throw new HttpException(400, 'Data is empty');

    const findConversation: IConversation = await this.conversations.findById(conversationId);
    if (!findConversation) throw new HttpException(409, 'Conversation not found');

    const updateConversationById: IConversation = await this.conversations.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          name: !isEmpty(conversationData.name) ? conversationData.name : findConversation.name,
          avatar: !isEmpty(conversationData.avatar) ? conversationData.avatar : findConversation.avatar,
        },
      },
      { new: true },
    );

    return updateConversationById;
  }

  public async addMembersToConversation(userId: string, conversationId: string, memberIds: string[]) {
    if (isEmpty(memberIds)) throw new HttpException(400, 'Data is empty');

    const findConversation: IConversation = await this.conversations.findById(conversationId);
    if (!findConversation) throw new HttpException(409, 'Conversation not found');

    const isJoined = findConversation.members.filter(member => member.toString() === userId);
    if (!isJoined) {
      throw new HttpException(400, 'You have not joined this conversation');
    }

    if (findConversation.type === ConversationType.PRIVATE) {
      // const memberIdsInConversation: string[] = findConversation.members.map(member => member.toString());

      // const newConversationData: CreateConversationDto = {
      //   name: findConversation.name,
      //   ownerId: findConversation.onwer.toString(),
      //   memberIds: [...memberIdsInConversation, ...memberIds],
      //   avatar: findConversation.avatar,
      // };

      // const newConversation: IConversation = await this.createConversationTypeGroup(newConversationData);

      // if (newConversation) {
      //   // create new notification via socket
      // }

      // return newConversation;

      throw new HttpException(400, 'Cannot add members to private conversation');
    }

    const addMembersToConversation: IConversation = await this.conversations.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: {
          members: memberIds,
        },
      },
      { new: true },
    );

    if (addMembersToConversation) {
      // update user's conversations of member
      for (const memberId of memberIds) {
        await this.users.findByIdAndUpdate(memberId, {
          $addToSet: {
            conversations: addMembersToConversation._id,
          },
        });
      }

      // create new notification via socket
    }

    return addMembersToConversation;
  }

  public async kickMembersFromConversation(userId: string, conversationId: string, memberIds: string[]) {
    if (isEmpty(memberIds)) throw new HttpException(400, 'Data is empty');

    const findConversation: IConversation = await this.conversations.findById(conversationId);
    if (!findConversation) throw new HttpException(409, 'Conversation not found');

    if (findConversation.onwer.toString() !== userId) {
      throw new HttpException(400, 'Only owner can kick members');
    }

    if (findConversation.type === ConversationType.PRIVATE) {
      throw new HttpException(400, 'Cannot kick members from private conversation');
    }

    const newMembers = findConversation.members.filter(member => !memberIds.includes(member.toString()));

    if (newMembers.length < 2) {
      await this.conversations.findByIdAndDelete(conversationId);
    }

    const kickMembersFromConversation: IConversation = await this.conversations.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          members: newMembers,
        },
      },
      { new: true },
    );

    if (kickMembersFromConversation) {
      // update user's conversations of member
      for (const memberId of memberIds) {
        const findMember: IUser = await this.users.findById(memberId);
        const newConversations = findMember.conversations.filter(conversation => conversation.toString() !== conversationId);
        await this.users.findByIdAndUpdate(memberId, {
          $set: {
            conversations: newConversations,
          },
        });
      }

      // create new notification via socket
    }

    return kickMembersFromConversation;
  }

  public async leaveConversation(userId: string, conversationId: string) {
    const findConversation: IConversation = await this.conversations.findById(conversationId);
    if (!findConversation) throw new HttpException(409, 'Conversation not found');

    const findConversationIsJoined: IConversation = await this.conversations.findOne({
      _id: conversationId,
      $or: [{ members: { $in: [userId] } }, { onwer: userId }],
    });

    if (!findConversationIsJoined) throw new HttpException(409, 'You have not joined this conversation');

    if (findConversation.onwer.toString() === userId && findConversation.members.length > 1) {
      throw new HttpException(400, 'Owner cannot leave conversation because there are still members in this conversation');
    }

    const leaveConversation: IConversation = await this.conversations.findByIdAndUpdate(
      conversationId,
      {
        $pull: {
          members: userId,
        },
      },
      { new: true },
    );

    if (leaveConversation) {
      // update user's conversations of me
      await this.users.findByIdAndUpdate(userId, {
        $pull: {
          conversations: leaveConversation._id,
        },
      });

      // create new notification via socket
    }

    return leaveConversation;
  }

  public async softDeleteConversation(userId: string, conversationId: string): Promise<IConversation> {
    const findConversation: IConversation = await this.conversations.findById(conversationId);
    if (!findConversation) throw new HttpException(409, 'Conversation not found');

    if (findConversation.onwer.toString() !== userId) {
      throw new HttpException(400, 'Only owner can delete conversation');
    }

    const softDeleteConversationById: IConversation = await this.conversations.findByIdAndUpdate(
      conversationId,
      {
        deletedAt: new Date(),
      },
      { new: true },
    );

    if (!softDeleteConversationById) throw new HttpException(409, 'Conversation not found');

    return softDeleteConversationById;
  }

  public async restoreConversation(userId: string, conversationId: string): Promise<IConversation> {
    const findConversation: IConversation = await this.conversations.findById(conversationId);
    if (!findConversation) throw new HttpException(409, 'Conversation not found');

    if (findConversation.onwer.toString() !== userId) {
      throw new HttpException(400, 'Only owner can restore conversation');
    }

    const restoreConversationById: IConversation = await this.conversations.findByIdAndUpdate(
      conversationId,
      {
        deletedAt: null,
      },
      { new: true },
    );

    if (!restoreConversationById) throw new HttpException(409, 'Conversation not found');

    return restoreConversationById;
  }

  public async deleteConversation(userId: string, conversationId: string): Promise<IConversation> {
    const findConversation: IConversation = await this.conversations.findById(conversationId);
    if (!findConversation) throw new HttpException(409, 'Conversation not found');

    if (findConversation.onwer.toString() !== userId) {
      throw new HttpException(400, 'Only owner can delete conversation');
    }

    const deleteConversationById: IConversation = await this.conversations.findByIdAndDelete(conversationId);

    return deleteConversationById;
  }
}

export default ConversationsService;
