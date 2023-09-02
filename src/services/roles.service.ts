import roleModel from '@/models/roles.model';
import RoleRepository from '@/repositories/role.repository';

class RolesService {
  private readonly roles = roleModel;
  private readonly roleRepository: RoleRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
  }
}

export default RolesService;
