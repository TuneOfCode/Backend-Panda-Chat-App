import { AssignRoleDto, CreateRoleDto, UnassignRoleDto, UpdateRoleDto } from '@/dtos/roles.dto';
import { HttpException } from '@/exceptions/HttpException';
import { IParameter } from '@/interfaces/parameters.interface';
import { IRole } from '@/interfaces/roles.interface';
import { IUser } from '@/interfaces/users.interface';
import roleModel from '@/models/roles.model';
import userModel from '@/models/users.model';
import RoleRepository from '@/repositories/role.repository';
import UserRepository from '@/repositories/user.repository';
import { isEmpty } from '@/utils/util';

class RolesService {
  private readonly roles = roleModel;
  private readonly users = userModel;
  private readonly roleRepository: RoleRepository;
  private readonly userRepository: UserRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
    this.userRepository = new UserRepository();
  }

  public async createRole(roleData: CreateRoleDto): Promise<IRole> {
    if (isEmpty(roleData)) throw new HttpException(400, 'role data is empty');
    const newRole: IRole = await this.roles.create(roleData);
    return newRole;
  }

  public async findAllRole(params?: IParameter): Promise<IRole[]> {
    const findRoles: IRole[] = await this.roles.find(params);
    return findRoles;
  }

  public async findRoleById(roleId: string): Promise<IRole> {
    if (isEmpty(roleId)) throw new HttpException(400, 'RoleId is empty');
    const findRole: IRole = await this.roles.findById(roleId);

    if (findRole.users.length > 0) {
      const findRoleWithRelations: IRole = await this.roles.findById(roleId).populate('users');
      return findRoleWithRelations;
    }

    return findRole;
  }

  public async updateRole(roleId: string, roleData: UpdateRoleDto): Promise<IRole> {
    if (isEmpty(roleId)) throw new HttpException(400, 'RoleId is empty');
    if (isEmpty(roleData)) throw new HttpException(400, 'roleData is empty');

    const findRole: IRole = await this.roles.findById(roleId);
    if (!findRole) throw new HttpException(409, "Role doesn't exist");

    const updateRoleById: IRole = await this.roles.findByIdAndUpdate(roleId, { name: roleData.name });
    return updateRoleById;
  }

  public async assignRole(roleId: string, roleData: AssignRoleDto): Promise<IRole> {
    if (isEmpty(roleId)) throw new HttpException(400, 'RoleId is empty');
    if (isEmpty(roleData)) throw new HttpException(400, 'roleData is empty');

    const findRole: IRole = await this.roles.findById(roleId);
    if (!findRole) throw new HttpException(409, "Role doesn't exist");

    roleData.userIds.forEach(async userId => {
      const findUser: IUser = await this.userRepository.findById(userId);
      if (!findUser) throw new HttpException(409, `User has ${userId} doesn't exist`);

      const isUserHasRole = findUser.roles.filter(role => role._id.toString() === findRole._id.toString()).length > 0;
      const isRoleHasUser = findRole.users.filter(user => user._id.toString() === findUser._id.toString()).length > 0;

      if (!isUserHasRole && !isRoleHasUser) {
        await this.users
          .findByIdAndUpdate(userId, {
            $push: {
              roles: findRole._id,
            },
          })
          .exec();

        await this.roles
          .findByIdAndUpdate(roleId, {
            $push: {
              users: findUser._id,
            },
          })
          .exec();
      }
    });

    const assignRoleById: IRole = await this.roles.findById(roleId);

    return assignRoleById;
  }

  public async unassignRole(roleId: string, roleData: UnassignRoleDto): Promise<IRole> {
    if (isEmpty(roleId)) throw new HttpException(400, 'RoleId is empty');
    if (isEmpty(roleData)) throw new HttpException(400, 'roleData is empty');

    const findRole: IRole = await this.roles.findById(roleId);
    if (!findRole) throw new HttpException(409, "Role doesn't exist");

    roleData.userIds.forEach(async userId => {
      const findUser: IUser = await this.userRepository.findById(userId);
      if (!findUser) throw new HttpException(409, `User has ${userId} doesn't exist`);

      const isUserHasRole = findUser.roles.filter(role => role._id.toString() === findRole._id.toString()).length > 0;
      const isRoleHasUser = findRole.users.filter(user => user._id.toString() === findUser._id.toString()).length > 0;

      if (isUserHasRole && isRoleHasUser) {
        await this.users
          .findByIdAndUpdate(userId, {
            $pull: {
              roles: findRole._id,
            },
          })
          .exec();

        await this.roles
          .findByIdAndUpdate(roleId, {
            $pull: {
              users: findUser._id,
            },
          })
          .exec();
      }
    });

    const unassignRoleById: IRole = await this.roles.findById(roleId);

    return unassignRoleById;
  }

  public async deleteRole(roleId: string): Promise<IRole> {
    if (isEmpty(roleId)) throw new HttpException(400, 'RoleId is empty');

    const findRole: IRole = await this.roles.findByIdAndDelete(roleId);
    if (!findRole) throw new HttpException(409, "Role doesn't exist");

    return findRole;
  }
}

export default RolesService;
