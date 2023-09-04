import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { IRoutes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { LoginDto, RefreshTokenDto } from '@/dtos/auth.dto';
import uploadMiddleware from '@/middlewares/upload.middleware';
import { uploadConst } from '@/constants';
import { UploadExtType } from '@/interfaces/upload.interface';

class AuthRoute implements IRoutes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      uploadMiddleware({
        allowedExtType: UploadExtType.IMAGE,
      }).single(uploadConst.FIELD_NAME.AVATAR),
      validationMiddleware(CreateUserDto, 'body'),
      this.authController.signUp,
    );

    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto, 'body'), this.authController.logIn);

    this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logOut);

    this.router.post(`${this.path}/refresh-token`, authMiddleware, validationMiddleware(RefreshTokenDto, 'body'), this.authController.refreshToken);
  }
}

export default AuthRoute;
