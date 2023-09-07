import RolesController from '@/controllers/roles.controller';
import { AssignRoleDto, CreateRoleDto, UnassignRoleDto, UpdateRoleDto } from '@/dtos/roles.dto';
import { IRoutes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';

class RolesRoute implements IRoutes {
  public path = '/roles';
  public router = Router();
  public rolesController = new RolesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.rolesController.getRoles);
    this.router.get(`${this.path}/:id`, authMiddleware, this.rolesController.getRoleById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateRoleDto, 'body'), this.rolesController.createRole);
    this.router.patch(`${this.path}/:id/assign`, authMiddleware, validationMiddleware(AssignRoleDto, 'body', true), this.rolesController.assignRole);
    this.router.patch(
      `${this.path}/:id/unassign`,
      authMiddleware,
      validationMiddleware(UnassignRoleDto, 'body', true),
      this.rolesController.unassignRole,
    );
    this.router.patch(`${this.path}/:id`, authMiddleware, validationMiddleware(UpdateRoleDto, 'body', true), this.rolesController.updateRole);
  }
}

export default RolesRoute;
