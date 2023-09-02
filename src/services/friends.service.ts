import friendModel from '@/models/friends.model';
import FriendRepository from '@/repositories/friend.repository';

class FriendsService {
  private readonly friends = friendModel;
  private readonly friendRepository: FriendRepository;

  constructor() {
    this.friendRepository = new FriendRepository();
  }
}

export default FriendsService;
