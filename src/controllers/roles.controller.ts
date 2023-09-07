import { AssignRoleDto, CreateRoleDto, UpdateRoleDto } from '@/dtos/roles.dto';
import { IRole } from '@/interfaces/roles.interface';
import RolesService from '@/services/roles.service';
import { delCache, getAllKeys, setCache } from '@/utils/util';
import { NextFunction, Request, Response } from 'express';

class RolesController {
  private readonly rolesService = new RolesService();

  public getRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllRolesData: IRole[] = await this.rolesService.findAllRole();

      // add cache data
      await setCache(req.originalUrl, findAllRolesData);

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
      await setCache(req.originalUrl, findOneRoleData);

      res.status(200).json({ data: findOneRoleData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // remove cache data
      const keys = await getAllKeys();
      const deletedKeys = keys.filter(key => key.includes('roles') || key.includes('users'));
      console.log('===> keys is deleted in create role:', deletedKeys);
      await delCache(deletedKeys);

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
      const keys = await getAllKeys();
      const deletedKeys = keys.filter(key => key.includes('roles') || key.includes('users'));
      console.log('===> keys is deleted in update role:', deletedKeys);
      await delCache(deletedKeys);

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
      const keys = await getAllKeys();
      const deletedKeys = keys.filter(key => key.includes('roles') || key.includes('users'));
      console.log('===> keys is deleted in assign role:', deletedKeys);
      await delCache(deletedKeys);

      const roleId: string = req.params.id;
      const roleData: AssignRoleDto = req.body;

      const assignedRoleData: IRole = await this.rolesService.assignRole(roleId, roleData);

      res.status(200).json({ data: assignedRoleData, message: 'assigned role' });
    } catch (error) {
      next(error);
    }
  };

  public unassignRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // remove cache data
      const keys = await getAllKeys();
      const deletedKeys = keys.filter(key => key.includes('roles') || key.includes('users'));
      console.log('===> keys is deleted in unassign role:', deletedKeys);
      await delCache(deletedKeys);

      const roleId: string = req.params.id;

      const roleData: AssignRoleDto = req.body;

      const unassignedRoleData: IRole = await this.rolesService.unassignRole(roleId, roleData);

      res.status(200).json({ data: unassignedRoleData, message: 'unassigned role' });
    } catch (error) {
      next(error);
    }
  };
}

export default RolesController;
