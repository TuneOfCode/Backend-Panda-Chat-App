import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { RoleType } from '@/interfaces/roles.interface';
import roleModel from '@/models/roles.model';
import { isEmpty } from '@/utils/util';
import { NextFunction, Response } from 'express';

const authorizeMiddleware = (roles: string | string[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const isGuestInRole = typeof roles === 'string' && !isEmpty(roles) && roles === RoleType.GUEST;
      const isGuestInRoles = Array.isArray(roles) && roles.length > 0 && roles.includes(RoleType.GUEST);
      const isPublic = (typeof roles === 'string' && isEmpty(roles)) || (Array.isArray(roles) && roles.length === 0);

      if (isGuestInRole || isGuestInRoles || isPublic) {
        return next();
      }

      let listOfRoles: string[] = [];

      if (typeof roles === 'string' && !isEmpty(roles)) {
        listOfRoles.push(roles);
      }

      if (Array.isArray(roles) && roles.length > 0) {
        listOfRoles = roles;
      }
      console.log('===> listOfRoles:', listOfRoles);

      listOfRoles.forEach(async role => {
        const roleId = (
          await roleModel.findOne({
            name: {
              $regex: role,
              $options: 'i',
            },
          })
        )._id.toString();
        console.log('===> roleId:', roleId);

        const isAuthorized = req.user.roles.includes(roleId);
        console.log('===> isAuthorized:', isAuthorized);
        if (!isAuthorized) {
          return next(new HttpException(403, 'Forbidden'));
        }
      });

      return next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorizeMiddleware;
