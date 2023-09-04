import { HOST_UPLOAD } from '@/config';
import { uploadConst } from '@/constants';
import { LoginDto, RefreshTokenDto } from '@/dtos/auth.dto';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';

class AuthController {
  private readonly authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let avatar = null;
      if (req.file) {
        const folderUploadedFile = req.file.path.replace(uploadConst.SAVE_PLACES.ROOT, '');
        avatar = `${HOST_UPLOAD}${folderUploadedFile}`;
      }

      const userData: CreateUserDto = {
        ...req.body,
        avatar,
      };

      const signUpUserData: IUser = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      // remove path file when error
      if (req.path && fs.existsSync(req.path)) {
        fs.unlinkSync(req.path);
      }
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginDto = req.body;
      const { cookie, findUser, tokenData } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, meta: tokenData, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: IUser = req.user;
      const logOutUserData: IUser = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: RefreshTokenDto = req.body;
      const { cookie, findUser, tokenData } = await this.authService.refreshToken(token);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, meta: tokenData, message: 'refreshed token' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
