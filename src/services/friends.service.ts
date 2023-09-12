import { CreateConversationTypePrivateDto } from '@/dtos/conversations.dto';
import { CreateFriendRequestDto } from '@/dtos/friends.dto';
import { HttpException } from '@/exceptions/HttpException';
import { FriendStatus, IFriend } from '@/interfaces/friends.interface';
import { IParameter } from '@/interfaces/parameters.interface';
import { IUser } from '@/interfaces/users.interface';
import conversationModel from '@/models/conversations.model';
import friendModel from '@/models/friends.model';
import userModel from '@/models/users.model';
import FriendRepository from '@/repositories/friend.repository';
import UserRepository from '@/repositories/user.repository';
import { isEmpty } from '@/utils/util';
import ConversationsService from './conversations.service';

class FriendsService {
  private readonly friends = friendModel;
  private readonly users = userModel;
  private readonly conversations = conversationModel;
  private readonly friendRepository: FriendRepository;
  private readonly userRepository: UserRepository;
  private readonly conversationService: ConversationsService;

  constructor() {
    this.friendRepository = new FriendRepository();
    this.userRepository = new UserRepository();
    this.conversationService = new ConversationsService();
  }

  public async createFriendRequest(friendData: CreateFriendRequestDto): Promise<IFriend> {
    if (isEmpty(friendData)) throw new HttpException(400, "You're not friend request data");

    if (friendData.senderId === friendData.receiverId) {
      throw new HttpException(400, "You can't send friend request to yourself");
    }

    const listOfFriendRequestsIsPending: IFriend[] = await this.friendRepository.findFriendRequestViaStatusBySenderAndReceiver(
      friendData.senderId,
      friendData.receiverId,
      FriendStatus.PENDING,
    );

    const listOfFriendRequestsIsAccepted: IFriend[] = await this.friendRepository.findFriendRequestViaStatusBySenderAndReceiver(
      friendData.senderId,
      friendData.receiverId,
      FriendStatus.ACCEPTED,
    );

    const listOfFriendRequestsIsRejected: IFriend[] = await this.friendRepository.findFriendRequestViaStatusBySenderAndReceiver(
      friendData.senderId,
      friendData.receiverId,
      FriendStatus.REJECTED,
    );

    const isFriend: boolean = listOfFriendRequestsIsAccepted.length > 0;
    if (isFriend) throw new HttpException(400, `You're already friend with this user`);

    const isFriendRequestExist: boolean = listOfFriendRequestsIsPending.length > 0 || listOfFriendRequestsIsRejected.length > 0;
    if (isFriendRequestExist) throw new HttpException(400, `You've already sent or received friend request to this user`);

    const findReceiver: IUser = await this.userRepository.findById(friendData.receiverId);
    if (!findReceiver) throw new HttpException(409, `This receiver is not exist`);

    const newFriendRequest: IFriend = await this.friends.create({
      sender: friendData.senderId,
      receiver: friendData.receiverId,
      status: FriendStatus.PENDING,
    });

    if (newFriendRequest) {
      // create notification and send to receiver via socket
    }

    return newFriendRequest;
  }

  public async getAllFriendRequestOfMe(userId: string, params?: IParameter): Promise<IFriend[] | IUser> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");
    let search: string = null;
    let type: string = null;
    let sender: string = null;
    let receiver: string = null;

    if (!isEmpty(params) && Object.keys(params.filters).length > 0) {
      search = params.filters.search && typeof params.filters.search === 'string' ? params.filters.search.toString().toLowerCase() : null;
      type = params.filters.type && typeof params.filters.type === 'string' ? params.filters.type.toString().toLowerCase() : null;
      sender = params.filters.sender && typeof params.filters.sender === 'string' ? params.filters.sender.toString().toLowerCase() : null;
      receiver = params.filters.receiver && typeof params.filters.receiver === 'string' ? params.filters.receiver.toString().toLowerCase() : null;
    }

    if (!isEmpty(params) && type === FriendStatus.PENDING && sender === 'me') {
      return await this.friendRepository.findAllFriendRequestBySenderIsMe(userId, params);
    }

    if (!isEmpty(params) && type === FriendStatus.PENDING && receiver === 'me') {
      return await this.friendRepository.findAllFriendRequestByReceiverIsMe(userId, params);
    }

    if (!isEmpty(params) && type === FriendStatus.ACCEPTED) {
      return await this.userRepository.findAllFriendsOfMe(userId, search);
    }

    if (!isEmpty(params) && type === FriendStatus.REJECTED && sender === 'me') {
      return await this.friendRepository.findAllFriendRequestBySenderIsMe(userId, params, type);
    }

    if (!isEmpty(params) && type === FriendStatus.REJECTED && receiver === 'me') {
      return await this.friendRepository.findAllFriendRequestByReceiverIsMe(userId, params, type);
    }

    return await this.friendRepository.findAllFriendRequestOfMe(userId, params);
  }

  public async getFriendRequestById(userId: string, friendId: string): Promise<IFriend> {
    return await this.friends.findOne({
      _id: friendId,
      $or: [{ sender: userId }, { receiver: userId }],
    });
  }

  public async acceptFriendRequest(userId: string, friendId: string): Promise<IFriend> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");
    if (isEmpty(friendId)) throw new HttpException(400, "You're not friendId");

    const findFriendRequestIsPending: IFriend = await this.friends.findOne({
      _id: friendId,
      receiver: userId,
      status: FriendStatus.PENDING,
    });

    if (!findFriendRequestIsPending) throw new HttpException(409, `This friend request is not exist`);

    const friend: IFriend = await this.friends.findByIdAndUpdate(friendId, { status: FriendStatus.ACCEPTED }, { new: true });

    if (friend) {
      // add sender is user friend in user's friend list of me is receiver
      await this.users.findByIdAndUpdate(userId, { $push: { friends: friend.sender } }, { new: true });

      // add me is sender in friend's friend list of user is receiver
      await this.users.findByIdAndUpdate(friend.sender, { $push: { friends: userId } }, { new: true });

      // create conversation for sender and receiver
      const findSender: IUser = await this.users.findById(friend.sender._id.toString());
      const conversationData: CreateConversationTypePrivateDto = {
        name: `${findSender.firstName} ${findSender.lastName}`,
        ownerId: userId,
        memberIds: [findSender._id.toString()],
        avatar: findSender.avatar,
      };
      await this.conversationService.createConversationTypePrivate(userId, conversationData);

      // create notification and send to receiver via socket
    }

    return friend;
  }

  public async rejectFriendRequest(userId: string, friendId: string): Promise<IFriend> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");
    if (isEmpty(friendId)) throw new HttpException(400, "You're not friendId");

    const findFriendRequestIsPending: IFriend = await this.friends.findOne({
      _id: friendId,
      receiver: userId,
      status: FriendStatus.PENDING,
    });

    if (!findFriendRequestIsPending) throw new HttpException(409, `This friend request is not exist`);

    return await this.friends.findByIdAndUpdate(friendId, { status: FriendStatus.REJECTED }, { new: true });
  }

  public async cancelFriendRequest(userId: string, friendId: string): Promise<IFriend> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");
    if (isEmpty(friendId)) throw new HttpException(400, "You're not friendId");

    const findFrinedRequestIsPendingByISent: IFriend = await this.friends.findOne({
      _id: friendId,
      sender: userId,
      status: FriendStatus.PENDING,
    });

    if (!findFrinedRequestIsPendingByISent) throw new HttpException(409, `This friend request is not exist`);

    const friendRequestIsCanceled: IFriend = await this.friends.findByIdAndDelete(friendId);

    if (friendRequestIsCanceled) {
      // delete notification
    }

    return friendRequestIsCanceled;
  }

  public async unfriend(userId: string, friendId: string): Promise<IFriend> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");
    if (isEmpty(friendId)) throw new HttpException(400, "You're not friendId");

    const findFriendRequestIsAccepted: IFriend = await this.friends.findOne({
      _id: friendId,
      $or: [{ sender: userId }, { receiver: userId }],
      status: FriendStatus.ACCEPTED,
    });

    if (!findFriendRequestIsAccepted) throw new HttpException(409, `This friend request is not exist`);

    const unfriend: IFriend = await this.friends.findByIdAndDelete(friendId);

    if (unfriend) {
      // remove sender is user friend in user's friend list of me is receiver
      await this.users.findByIdAndUpdate(userId, { $pull: { friends: unfriend.sender } }, { new: true });

      // remove me is sender in friend's friend list of user is receiver
      await this.users.findByIdAndUpdate(unfriend.sender, { $pull: { friends: userId } }, { new: true });

      // remove receiver is user friend in user's friend list of me is sender
      await this.users.findByIdAndUpdate(userId, { $pull: { friends: unfriend.receiver } }, { new: true });

      // remove me is receiver in friend's friend list of user is sender
      await this.users.findByIdAndUpdate(unfriend.receiver, { $pull: { friends: userId } }, { new: true });
    }

    return unfriend;
  }

  public async deleteFriendRequest(userId: string, friendId: string): Promise<IFriend> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");
    if (isEmpty(friendId)) throw new HttpException(400, "You're not friendId");

    const findFriendRequestIsRejected: IFriend = await this.friends.findOne({
      _id: friendId,
      $or: [{ sender: userId }, { receiver: userId }],
      status: FriendStatus.REJECTED,
    });

    if (!findFriendRequestIsRejected) throw new HttpException(409, `This friend request is not exist`);

    return await this.friends.findByIdAndDelete(friendId);
  }
}

export default FriendsService;
