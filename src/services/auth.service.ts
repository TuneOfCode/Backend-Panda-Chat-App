import { LoginDto, RefreshTokenDto, UpdateMeDto } from '@/dtos/auth.dto';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<IUser> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: IUser = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; findUser: IUser; tokenData: TokenData }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ $or: [{ email: userData.username }, { username: userData.username }] });

    // if (!findUser) throw new HttpException(409, `This email ${userData.username} was not found`);
    if (!findUser) throw new HttpException(409, `Wrong username or password`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    // if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');
    if (!isPasswordMatching) throw new HttpException(409, `Wrong username or password`);

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    // save refresh token in database
    await this.users.findByIdAndUpdate(findUser._id, { refreshToken: tokenData.refreshToken });

    return { cookie, findUser, tokenData };
  }

  public async logout(userData: IUser): Promise<IUser> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public createToken(user: IUser): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60; // an hour
    const refreshToken: string = `${Date.now()}_${Math.random().toString(18).substring(2)}`;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }), refreshToken };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  public async refreshToken(token: RefreshTokenDto) {
    if (isEmpty(token)) throw new HttpException(400, 'Token is empty');

    const findUser: IUser = await this.users.findOne({ refreshToken: token.refreshToken });
    if (!findUser) throw new HttpException(409, `This token ${token.refreshToken} was not found`);

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    // save refresh token in database
    await this.users.findByIdAndUpdate(findUser._id, { refreshToken: tokenData.refreshToken });

    return { findUser, cookie, tokenData };
  }

  public async updateMe(userId: string, userData: UpdateMeDto) {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findById(userId);
    if (!findUser) throw new HttpException(409, `This user was not found`);

    const updateUserData: IUser = await this.users.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName: !isEmpty(userData.firstName) ? userData.firstName : findUser.firstName,
          lastName: !isEmpty(userData.lastName) ? userData.lastName : findUser.lastName,
          phone: !isEmpty(userData.phone) ? userData.phone : findUser.phone,
          address: !isEmpty(userData.address) ? userData.address : findUser.address,
          avatar: !isEmpty(userData.avatar) ? userData.avatar : findUser.avatar,
        },
      },
      { new: true },
    );

    return updateUserData;
  }
}

export default AuthService;
