import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateRoleRequest } from '../helpers/validators/createRoleRequestValidator';
import { StatusModel } from '../models/Status';
import { ICreateStatusRequest } from '../views/request/ICreateStatusRequest';
import { IUpdateStatusRequest } from '../views/request/IUpdateStatusRequest';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { HTTPStatus } from '../enums/HTTPStatusEnum';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';

class StatusController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllStatus);
    this.expressRouter.get('/:_id', this.getStatusById);
    this.expressRouter.post('', validateCreateRoleRequest, this.createStatus);
    this.expressRouter.put('/:_id', this.updateStatusById);
    this.expressRouter.delete('/:_id', this.deleteStatusById);
  };

  private getAllStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = await StatusModel.find();
      const details = { status };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all status.', details);
      res.status(HTTPStatus.OK).json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getStatusById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const status = await StatusModel.findOne({ _id });

      if (status) {
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got status.', status);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Status not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Status not found.', errors);
        res.status(404).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createStatus = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ICreateStatusRequest = req.body;

    const { name, description } = reqBody;

    try {
      const newStatus = new StatusModel({
        name,
        description
      });

      await newStatus.save();

      const apiResponse = new ApiResponse(true, 'Successfully created status.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateStatusById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const reqBody: IUpdateStatusRequest = req.body;

      const { name, description } = reqBody;

      let fieldsToBeUpdated: IUpdateStatusRequest = getNullFilteredAndDotifiedObject({
        name,
        description
      });

      await StatusModel.findOneAndUpdate({ _id }, fieldsToBeUpdated);

      const apiResponse = new ApiResponse(true, 'Updated status successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteStatusById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      await StatusModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted status successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };
}

const StatusControllerRouter = new StatusController().expressRouter;

export { StatusControllerRouter as StatusController };

export default StatusControllerRouter;
