import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateFaultRequest } from '../helpers/validators/createFaultRequestValidator';
import { FaultModel } from '../models/Fault';
import { ICreateFaultRequest } from '../views/request/ICreateFaultRequest';
import { IUpdateFaultRequest } from '../views/request/IUpdateFaultRequest';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import { HTTPStatus } from '../enums/HTTPStatusEnum';

class FaultController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllFaults);
    this.expressRouter.get('/:_id', this.getFaultById);
    this.expressRouter.post('', validateCreateFaultRequest, this.createFault);
    this.expressRouter.put('/:_id', this.updateFaultById);
    this.expressRouter.delete('/:_id', this.deleteFaultById);
    this.expressRouter.delete('', this.bulkDeleteFaultsByIds);
  };

  private getAllFaults = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const faults = await FaultModel.find().populate('status');
      const details = { faults };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all faults.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getFaultById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const fault = await FaultModel.findOne({ _id });

      if (fault) {
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got fault.', fault);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Fault not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Fault not found.', errors);
        res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createFault = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ICreateFaultRequest = req.body;

    const { name, description, fine } = reqBody;

    try {
      const newFault = new FaultModel({
        name,
        description
      });

      await newFault.save();

      const apiResponse = new ApiResponse(true, 'Successfully created fault.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateFaultById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const reqBody: IUpdateFaultRequest = req.body;

      const { name, description, fine } = reqBody;

      let fieldsToBeUpdated: IUpdateFaultRequest = getNullFilteredAndDotifiedObject({
        name,
        description
      });

      await FaultModel.findOneAndUpdate({ _id }, fieldsToBeUpdated);

      const apiResponse = new ApiResponse(true, 'Updated fault successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteFaultById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      await FaultModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted fault successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private bulkDeleteFaultsByIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqQueryIds = req.query._id;
      let _ids;
      if (typeof reqQueryIds === 'string') {
        _ids = [req.query._id];
      } else {
        _ids = [...reqQueryIds];
      }

      const response = await FaultModel.deleteMany({ _id: { $in: _ids } });
      if (response.n > 0) {
        const apiResponse = new ApiResponse(true, 'Bulk deleted faults successfully.');
        res.json(apiResponse);
      } else {
        const errors = {
          _ids: 'Some of the faults were not found.'
        };
        const apiErrorResponse = new ApiErrorResponse(true, "Couldn't delete faults.", errors);
        res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };
}

const FaultControllerRouter = new FaultController().expressRouter;

export { FaultControllerRouter as FaultController };

export default FaultControllerRouter;
