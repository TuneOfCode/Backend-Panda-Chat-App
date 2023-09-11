import { authConst } from '@/constants';
import { RegisterDto } from '@/dtos/auth.dto';
import { IUser } from '@/interfaces/users.interface';
import userModel from '@/models/users.model';
import { logger } from '@/utils/logger';
import bcrypt from 'bcrypt';

const createSeedUser = async () => {
  try {
    const hashPassword = await bcrypt.hash('123456', authConst.PASSWORD_SALT);
    const newUsers: RegisterDto[] = [
      {
        firstName: 'Nguyễn Anh',
        lastName: 'Hào',
        username: 'nahao',
        email: 'nahao@gmail.com',
        password: hashPassword,
        confirmPassword: hashPassword,
      },
      {
        firstName: 'Hoàng Thị Như',
        lastName: 'Quỳnh',
        username: 'htnquynh',
        email: 'htnquynh@gmail.com',
        password: hashPassword,
        confirmPassword: hashPassword,
      },
      {
        firstName: 'Trương Đình',
        lastName: 'Phúc',
        username: 'tdphuc',
        email: 'tdphuc@gmail.com',
        password: hashPassword,
        confirmPassword: hashPassword,
      },
      {
        firstName: 'Phan Đức',
        lastName: 'Trung',
        username: 'pdtrung',
        email: 'pdtrung@gmail.com',
        password: hashPassword,
        confirmPassword: hashPassword,
      },
      {
        firstName: 'Cao Nguyên',
        lastName: 'Trường',
        username: 'cntruong',
        email: 'cntruong@gmail.com',
        password: hashPassword,
        confirmPassword: hashPassword,
      },
      {
        firstName: 'Nguyễn Tiến',
        lastName: 'Đạt',
        username: 'ntdat',
        email: 'ntdat@gmail.com',
        password: hashPassword,
        confirmPassword: hashPassword,
      },
      {
        firstName: 'Nguyễn Đức',
        lastName: 'Tuyến',
        username: 'ndtuyen',
        email: 'ndtuyen@gmail.com',
        password: hashPassword,
        confirmPassword: hashPassword,
      },
      {
        firstName: 'Dương Công',
        lastName: 'Tiến',
        username: 'dctien',
        email: 'dctien@gmail.com',
        password: hashPassword,
        confirmPassword: hashPassword,
      },
    ];

    for (const newUser of newUsers) {
      // check if user already exists
      const userDb: IUser = await userModel.findOne({ email: newUser.email, username: newUser.username });
      if (userDb) {
        logger.info(`User has full name is ${userDb.firstName} ${userDb.lastName} already exists`);
        continue;
      }

      await new userModel(newUser).save();
      logger.info(`Created user successfully`);
    }
  } catch (error) {
    logger.error('Created user failure:', error);
  }
};

export default createSeedUser;
