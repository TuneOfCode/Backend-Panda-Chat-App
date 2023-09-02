import RolesController from '@/controllers/roles.controller';
import { IRoutes } from '@/interfaces/routes.interface';
import { Router } from 'express';

class RolesRoute implements IRoutes {
  public path = '/roles';
  public router = Router();
  public RolesController = new RolesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {}
}

export default RolesRoute;
