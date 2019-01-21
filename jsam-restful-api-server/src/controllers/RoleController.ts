import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateRoleRequest } from '../helpers/validators/createRoleRequestValidator';
import { RoleModel } from '../models/Role';
import { ICreateRoleRequest } from '../views/request/ICreateRoleRequest';
import { IUpdateRoleRequest } from '../views/request/IUpdateRoleRequest';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import { HTTPStatus } from '../enums/HTTPStatusEnum';

class RoleController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllRoles);
    this.expressRouter.get('/:_id', this.getRoleById);
    this.expressRouter.post('', validateCreateRoleRequest, this.createRole);
    this.expressRouter.put('/:_id', this.updateRoleById);
    this.expressRouter.delete('/:_id', this.deleteRoleById);
    this.expressRouter.delete('', this.bulkDeleteRolesByIds);
  };

  private getAllRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const roles = await RoleModel.find();
      const details = { roles };
      const apiDetailResponse = new ApiDetailResponse(
        true,
        'Successfully got all roles.',
        details
      );
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getRoleById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.params;
      const role = await RoleModel.findOne({ _id });

      if (role) {
        const apiDetailResponse = new ApiDetailResponse(
          true,
          'Successfully got role.',
          role
        );
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Role not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(
          false,
          'Role not found.',
          errors
        );
        res.status(404).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const reqBody: ICreateRoleRequest = req.body;

    const { name, description } = reqBody;

    try {
      const newRole = new RoleModel({
        name,
        description
      });

      await newRole.save();

      const apiResponse = new ApiResponse(true, 'Successfully created role.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateRoleById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.params;

      const reqBody: IUpdateRoleRequest = req.body;

      const { name, description } = reqBody;

      let fieldsToBeUpdated: IUpdateRoleRequest = getNullFilteredAndDotifiedObject(
        {
          name,
          description
        }
      );

      await RoleModel.findOneAndUpdate({ _id }, fieldsToBeUpdated);

      const apiResponse = new ApiResponse(true, 'Updated role successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteRoleById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.params;

      await RoleModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted role successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private bulkDeleteRolesByIds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reqQueryIds = req.query._id;
      let _ids;
      if (typeof reqQueryIds === 'string') {
        _ids = [req.query._id];
      } else {
        _ids = [...reqQueryIds];
      }

      const response = await RoleModel.deleteMany({ _id: { $in: _ids } });
      if (response.n > 0) {
        const apiResponse = new ApiResponse(
          true,
          'Bulk deleted roles successfully.'
        );
        res.json(apiResponse);
      } else {
        const errors = {
          _ids: 'Some of the roles were not found.'
        };
        const apiErrorResponse = new ApiErrorResponse(
          true,
          "Couldn't delete roles.",
          errors
        );
        res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };
}

const RoleControllerRouter = new RoleController().expressRouter;

export { RoleControllerRouter as RoleController };

export default RoleControllerRouter;
