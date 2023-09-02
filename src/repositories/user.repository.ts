import { IUser } from '@/interfaces/users.interface';
import userModel from '@/models/users.model';
import BaseRepository from './base.repository';

export default class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(userModel);
  }

  async findOneWithRelations(filter = {}): Promise<IUser | null> {
    return await this.model.findOne(filter).populate(['roles', 'conversations']).exec();
  }
}
