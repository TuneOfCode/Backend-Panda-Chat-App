import { IUser } from '@/interfaces/users.interface';
import userModel from '@/models/users.model';
import BaseRepository from './base.repository';

export default class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(userModel);
  }

  async findOneWithRelations(filter = {}): Promise<IUser | null> {
    return await this.model
      .findOne(filter)
      .populate([
        {
          path: 'role',
          select: ['_id', 'name'],
        },
        {
          path: 'conversations',
          select: ['_id', 'name', 'avatar', 'type', 'onwer', 'members'],
          populate: [
            {
              path: 'onwer',
              select: ['_id', 'firstName', 'lastName', 'username', 'email', 'avatar'],
            },
            {
              path: 'members',
              select: ['_id', 'firstName', 'lastName', 'username', 'email', 'avatar'],
            },
          ],
        },
        {
          path: 'friends',
          select: ['_id', 'firstName', 'lastName', 'username', 'email', 'avatar', 'phone', 'address'],
        },
      ])
      .exec();
  }

  async findAllFriendsOfMe(userId: string, search?: string): Promise<IUser> {
    const findFriendsOfme: IUser = await this.model
      .findById(userId)
      .populate([
        {
          path: 'friends',
          select: ['_id', 'firstName', 'lastName', 'username', 'email', 'avatar', 'phone', 'address'],
        },
      ])
      .select(['_id', 'firstName', 'lastName', 'username', 'email', 'avatar', 'phone', 'address'])
      .exec();

    if (search) {
      return await this.model
        .findById(userId)
        .populate([
          {
            path: 'friends',
            match: {
              $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
              ],
            },
            select: ['_id', 'firstName', 'lastName', 'username', 'email', 'avatar', 'phone', 'address'],
          },
        ])
        .select(['_id', 'firstName', 'lastName', 'username', 'email', 'avatar', 'phone', 'address'])
        .exec();
    }

    return findFriendsOfme;
  }
}
