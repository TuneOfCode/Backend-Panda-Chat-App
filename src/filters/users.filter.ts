import userModel, { userSchema } from '@/models/users.model';
import BaseFilter from '.';

class UsersFilter extends BaseFilter {
  constructor() {
    super(Object.keys(userSchema.paths));
  }
}

export default new UsersFilter();
