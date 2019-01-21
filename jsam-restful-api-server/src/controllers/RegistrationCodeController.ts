import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateRegistrationCodeRequest } from '../helpers/validators/createRegistrationCodeRequestValidator';
import { RegistrationCodeModel } from '../models/RegistrationCode';
import { ICreateRegistrationCodeRequest } from '../views/request/ICreateRegistrationCodeRequest';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredObject } from '../helpers/filters/updateObjectFilters';
import { HTTPStatus } from '../enums/HTTPStatusEnum';
class RegistrationCodeController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllRegistrationCodes);
    this.expressRouter.get('/:code', this.getRegistrationCode);
    this.expressRouter.get('/:_id', this.getRegistrationCode);
    this.expressRouter.post('', validateCreateRegistrationCodeRequest, this.createRegistrationCode);
    this.expressRouter.delete('/:_id', this.deleteRegistrationCodeById);
    this.expressRouter.delete('', this.bulkDeleteRegistrationCodesByIds);
  };

  private getAllRegistrationCodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registrationCodes = await RegistrationCodeModel.find();
      const details = { registrationCodes };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all registration codes.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getRegistrationCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id, code } = req.params;
      let registrationCode;
      if (_id) {
        registrationCode = await RegistrationCodeModel.findOne({ _id });
      } else if (code) {
        registrationCode = await RegistrationCodeModel.findOne({ code });
      }

      if (registrationCode) {
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got registration code.', registrationCode);
        res.json(apiDetailResponse);
      } else {
        let errors;
        if (_id) {
          errors = {
            _id: `Registration code not found with id '${_id}'.`
          };
        } else if (code) {
          errors = {
            code: `Registration code not found with code '${code}'.`
          };
        }
        const apiErrorResponse = new ApiErrorResponse(false, 'Registration code not found.', errors);
        res.status(404).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createRegistrationCode = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ICreateRegistrationCodeRequest = req.body;

    const { userType, validPeriod } = reqBody;

    try {
      const newRegistrationCode = new RegistrationCodeModel(
        getNullFilteredObject({
          userType,
          validPeriod
        })
      );

      await newRegistrationCode.save();

      const details = {
        registrationCode: newRegistrationCode.code
      };
      const apiResponse = new ApiDetailResponse(true, 'Successfully created registration code.', details);
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteRegistrationCodeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      await RegistrationCodeModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted registration code successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private bulkDeleteRegistrationCodesByIds = async (
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

      const response = await RegistrationCodeModel.deleteMany({ _id: { $in: _ids } });
      if (response.n > 0) {
        const apiResponse = new ApiResponse(
          true,
          'Bulk deleted registrationCodes successfully.'
        );
        res.json(apiResponse);
      } else {
        const errors = {
          _ids: 'Some of the registrationCodes were not found.'
        };
        const apiErrorResponse = new ApiErrorResponse(
          true,
          "Couldn't delete registrationCodes.",
          errors
        );
        res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };
}

const RegistrationCodeControllerRouter = new RegistrationCodeController().expressRouter;

export { RegistrationCodeControllerRouter as RegistrationCodeController };

export default RegistrationCodeControllerRouter;
