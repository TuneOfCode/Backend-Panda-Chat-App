import { FriendStatus, IFriend } from '@/interfaces/friends.interface';
import friendModel from '@/models/friends.model';
import BaseRepository from './base.repository';
import { IParameter, SortType } from '@/interfaces/parameters.interface';

export default class FriendRepository extends BaseRepository<IFriend> {
  constructor() {
    super(friendModel);
  }

  public async findFriendRequestViaStatusBySenderAndReceiver(senderId: string, receiverId: string, status: FriendStatus): Promise<IFriend[]> {
    return await this.model.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
      status: status,
    });
  }

  public async findAllFriendRequestOfMe(userId: string, params?: IParameter): Promise<IFriend[]> {
    params.filters = {
      $or: [{ sender: userId }, { receiver: userId }],
      // status: FriendStatus.PENDING,
    };

    return await this.find(params, ['sender', 'receiver']);
  }

  public async findAllFriendRequestBySenderIsMe(
    userId: string,
    params?: IParameter,
    status: FriendStatus = FriendStatus.PENDING,
  ): Promise<IFriend[]> {
    params.filters = { sender: userId, status: status };
    return await this.find(params);
  }

  public async findAllFriendRequestByReceiverIsMe(
    userId: string,
    params?: IParameter,
    status: FriendStatus = FriendStatus.PENDING,
  ): Promise<IFriend[]> {
    params.filters = { receiver: userId, status: status };
    return await this.find(params);
  }
}
