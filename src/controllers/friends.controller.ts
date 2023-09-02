import FriendsService from '@/services/friends.service';

class FriendsController {
  private readonly friendsService = new FriendsService();
}

export default FriendsController;
