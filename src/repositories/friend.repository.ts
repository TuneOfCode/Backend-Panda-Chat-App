import { IFriend } from '@/interfaces/friends.interface';
import friendModel from '@/models/friends.model';
import BaseRepository from './base.repository';

export default class FriendRepository extends BaseRepository<IFriend> {
  constructor() {
    super(friendModel);
  }
}
