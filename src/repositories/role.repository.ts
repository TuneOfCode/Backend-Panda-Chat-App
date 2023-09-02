import { IRole } from '@/interfaces/roles.interface';
import roleModel from '@/models/roles.model';
import BaseRepository from './base.repository';

export default class RoleRepository extends BaseRepository<IRole> {
  constructor() {
    super(roleModel);
  }
}
