import { authConst } from '@/constants';
import { IParameter } from '@/interfaces/parameters.interface';
import UserRepository from '@/repositories/user.repository';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { IUser } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { hash } from 'bcrypt';

class UsersService {
  private readonly users = userModel;
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async findAllUser(params?: IParameter): Promise<IUser[]> {
    const users: IUser[] = await this.userRepository.find(params);
    return users;
  }

  public async findUserById(userId: string): Promise<IUser> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: IUser = await this.userRepository.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<IUser> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, authConst.PASSWORD_SALT);
    const createUserData: IUser = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<IUser> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    if (userData.email) {
      const findUser: IUser = await this.users.findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, authConst.PASSWORD_SALT);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: IUser = await this.users.findByIdAndUpdate(userId, { userData });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<IUser> {
    const deleteUserById: IUser = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }
}

export default UsersService;
