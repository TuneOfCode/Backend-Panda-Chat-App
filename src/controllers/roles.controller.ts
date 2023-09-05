import { AssignRoleDto, CreateRoleDto, UpdateRoleDto } from '@/dtos/roles.dto';
import { ICacheRoleKey } from '@/interfaces/caches.interface';
import { IRole } from '@/interfaces/roles.interface';
import { IUser } from '@/interfaces/users.interface';
import RolesService from '@/services/roles.service';
import { delCache, setCache } from '@/utils/util';
import { NextFunction, Request, Response } from 'express';

class RolesController {
  private readonly rolesService = new RolesService();
  public cacheKeys: ICacheRoleKey = {
    getRoles: '',
    getRoleById: '',
  };

  public getRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllRolesData: IRole[] = await this.rolesService.findAllRole();

      // add cache data
      this.cacheKeys.getRoles = req.originalUrl || req.url;
      await setCache(this.cacheKeys.getRoles, findAllRolesData);

      res.status(200).json({ data: findAllRolesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId: string = req.params.id;
      const findOneRoleData: IRole = await this.rolesService.findRoleById(roleId);

      // add cache data
      this.cacheKeys.getRoleById = req.originalUrl || req.url;
      await setCache(this.cacheKeys.getRoleById, findOneRoleData);

      res.status(200).json({ data: findOneRoleData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // remove cache data
      await delCache([this.cacheKeys.getRoles, this.cacheKeys.getRoleById]);

      const roleData: CreateRoleDto = req.body;
      const createdRoleData: IRole = await this.rolesService.createRole(roleData);

      res.status(201).json({ data: createdRoleData, message: 'created role' });
    } catch (error) {
      next(error);
    }
  };

  public updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // remove cache data
      await delCache([this.cacheKeys.getRoles, this.cacheKeys.getRoleById]);

      const roleId: string = req.params.id;
      const roleData: UpdateRoleDto = req.body;

      const updatedRoleData: IRole = await this.rolesService.updateRole(roleId, roleData);

      res.status(200).json({ data: updatedRoleData, message: 'updated role' });
    } catch (error) {
      next(error);
    }
  };

  public assignRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // remove cache data
      await delCache([this.cacheKeys.getRoles, this.cacheKeys.getRoleById]);

      const roleId: string = req.params.id;
      const roleData: AssignRoleDto = req.body;

      const assignedRoleData: IRole = await this.rolesService.assignRole(roleId, roleData);

      res.status(200).json({ data: assignedRoleData, message: 'assigned role' });
    } catch (error) {
      next(error);
    }
  };
}

export default RolesController;
