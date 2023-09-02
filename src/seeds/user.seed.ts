import { authConst } from '@/constants';
import { RegisterDto } from '@/dtos/auth.dto';
import { IUser } from '@/interfaces/users.interface';
import userModel from '@/models/users.model';
import { logger } from '@/utils/logger';
import bcrypt from 'bcrypt';

const createSeedUser = async () => {
  try {
    const hashPassword = await bcrypt.hash('123456', authConst.PASSWORD_SALT);
    const newUser: RegisterDto = {
      firstName: 'Trần Thanh',
      lastName: 'Tú',
      username: 'tuneofcode',
      email: 'kingproup1111@gmail.com',
      password: hashPassword,
      confirmPassword: hashPassword,
    };

    // check if user already exists
    const userDb: IUser = await userModel.findOne({ email: newUser.email });
    if (userDb) {
      logger.info('User already exists');
      return;
    }

    await new userModel(newUser).save();
    logger.info('Created user successfully');
  } catch (error) {
    logger.error('Created user failure:', error);
  }
};

export default createSeedUser;
