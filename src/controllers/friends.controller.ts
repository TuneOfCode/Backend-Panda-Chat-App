import { CreateFriendRequestDto } from '@/dtos/friends.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { RequestWithQuery } from '@/interfaces/parameters.interface';
import FriendsService from '@/services/friends.service';
import { NextFunction, Request, Response } from 'express';

class FriendsController {
  private readonly friendsService = new FriendsService();

  public createFriendRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const senderId: string = req.user._id.toString();
      const friendData: CreateFriendRequestDto = {
        senderId,
        receiverId: req.body.receiverId.toString(),
      };
      const newFriendRequest = await this.friendsService.createFriendRequest(friendData);

      res.status(201).json({ data: newFriendRequest, message: 'Created friend request' });
    } catch (error) {
      next(error);
    }
  };

  public getAllFriendRequestOfMe = async (req: RequestWithUser & RequestWithQuery, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const params = {
        filters: {
          search: req.query.search,
          type: req.query.type,
          sender: req.query.sender,
          receiver: req.query.receiver,
        },
        ...req.queryParams,
      };
      const friendRequests = await this.friendsService.getAllFriendRequestOfMe(userId, params);

      res.status(200).json({ data: friendRequests, message: 'Find all friend request' });
    } catch (error) {
      next(error);
    }
  };

  public getFriendRequestById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const friendId: string = req.params.id.toString();
      const friendRequest = await this.friendsService.getFriendRequestById(userId, friendId);

      res.status(200).json({ data: friendRequest, message: 'Find friend request by id' });
    } catch (error) {
      next(error);
    }
  };

  public acceptFriendRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const friendId: string = req.params.id.toString();
      const friend = await this.friendsService.acceptFriendRequest(userId, friendId);

      res.status(200).json({ data: friend, message: 'Accept friend request' });
    } catch (error) {
      next(error);
    }
  };

  public rejectFriendRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const friendId: string = req.params.id.toString();
      const friend = await this.friendsService.rejectFriendRequest(userId, friendId);

      res.status(200).json({ data: friend, message: 'Reject friend request' });
    } catch (error) {
      next(error);
    }
  };

  public cancelFriendRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const friendId: string = req.params.id.toString();
      const friend = await this.friendsService.cancelFriendRequest(userId, friendId);

      res.status(200).json({ data: friend, message: 'Cancel friend request' });
    } catch (error) {
      next(error);
    }
  };

  public unfriend = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const friendId: string = req.params.id.toString();
      const friend = await this.friendsService.unfriend(userId, friendId);

      res.status(200).json({ data: friend, message: 'Unfriend' });
    } catch (error) {
      next(error);
    }
  };

  public deleteFriendRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id.toString();
      const friendId: string = req.params.id.toString();
      const friend = await this.friendsService.deleteFriendRequest(userId, friendId);

      res.status(200).json({ data: friend, message: 'Delete friend request' });
    } catch (error) {
      next(error);
    }
  };
}

export default FriendsController;
