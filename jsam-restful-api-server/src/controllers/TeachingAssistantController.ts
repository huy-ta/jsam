import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateTeachingAssistantRequest } from '../helpers/validators/createTeachingAssistantValidator';
import { TeachingAssistantModel } from '../models/TeachingAssistant';
import { ICreateTeachingAssistantRequest } from '../views/request/ICreateTeachingAssistantRequest';
import { IUpdateTeachingAssistantRequest } from '../views/request/IUpdateTeachingAssistantRequest';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import { denormAllStudyPhaseTeachingAssistants } from '../services/studyPhaseService';

class TeachingAssistantController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllTeachingAssistants);
    this.expressRouter.get('/:_id', this.getTeachingAssistantById);
    this.expressRouter.get('/email/:email', this.getTeachingAssistantByEmail);
    this.expressRouter.post('', validateCreateTeachingAssistantRequest, this.createTeachingAssistant);
    this.expressRouter.put('/:_id', this.updateTeachingAssistantById);
    this.expressRouter.put('/email/:email', this.updateTeachingAssistantByEmail);
    this.expressRouter.delete('/:_id', this.deleteTeachingAssistantById);
  };

  private getAllTeachingAssistants = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teachingAssistants = await TeachingAssistantModel.find().populate('role');
      const details = { teachingAssistants };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all teaching assistants.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getTeachingAssistantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const teachingAssistant = await TeachingAssistantModel.findOne({ _id }).populate('role');

      if (teachingAssistant) {
        const apiDetailResponse = new ApiDetailResponse(
          true,
          'Successfully got Teaching Assistant.',
          teachingAssistant
        );
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Teaching assistant not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Teaching assistant not found.', errors);
        res.status(404).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private getTeachingAssistantByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;
      const teachingAssistant = await TeachingAssistantModel.findOne({ email }).populate('role');

      if (teachingAssistant) {
        const apiDetailResponse = new ApiDetailResponse(
          true,
          'Successfully got Teaching Assistant.',
          teachingAssistant
        );
        res.json(apiDetailResponse);
      } else {
        const errors = {
          email: `Teaching assistant not found with email '${email}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Teaching assistant not found.', errors);
        res.status(404).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createTeachingAssistant = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ICreateTeachingAssistantRequest = req.body;

    const { name, email, gender, phone, role, facebook, dateOfBirth } = reqBody;

    try {
      const newTeachingAssistant = new TeachingAssistantModel({
        name,
        gender,
        email,
        phone,
        role,
        facebook,
        dateOfBirth
      });

      await newTeachingAssistant.save();

      const apiResponse = new ApiResponse(true, 'Successfully created teaching assistant.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateTeachingAssistantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const reqBody: IUpdateTeachingAssistantRequest = req.body;

      const { name, email, gender, phone, role, facebook, dateOfBirth } = reqBody;

      let fieldsToBeUpdated: IUpdateTeachingAssistantRequest = getNullFilteredAndDotifiedObject({
        name,
        gender,
        email,
        phone,
        role,
        facebook,
        dateOfBirth
      });

      const foundTeachingAssistant = await TeachingAssistantModel.findOne({ _id });

      let isNameUpdated = false;
      if (name !== foundTeachingAssistant.name) {
        isNameUpdated = true;
      }

      await foundTeachingAssistant.update(fieldsToBeUpdated);

      // If teaching assistant's name is updated, then update all the denormalized name values in
      // other documents.
      if (isNameUpdated) {
        await denormAllStudyPhaseTeachingAssistants(_id);
      }

      const apiResponse = new ApiResponse(true, 'Updated teaching assistant successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateTeachingAssistantByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;

      const reqBody: IUpdateTeachingAssistantRequest = req.body;

      const { name, gender, phone, role, facebook, dateOfBirth } = reqBody;

      let fieldsToBeUpdated: IUpdateTeachingAssistantRequest = getNullFilteredAndDotifiedObject({
        name,
        gender,
        phone,
        role,
        facebook,
        dateOfBirth
      });

      const foundTeachingAssistant = await TeachingAssistantModel.findOne({ email });

      let isNameUpdated = false;
      if (name !== foundTeachingAssistant.name) {
        isNameUpdated = true;
      }

      await foundTeachingAssistant.update(fieldsToBeUpdated);

      // If teaching assistant's name is updated, then update all the denormalized name values in
      // other documents.
      if (isNameUpdated) {
        await denormAllStudyPhaseTeachingAssistants(email);
      }

      const apiResponse = new ApiResponse(true, 'Updated teaching assistant successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteTeachingAssistantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      await TeachingAssistantModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted teaching assistant successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };
}

const TeachingAssistantControllerRouter = new TeachingAssistantController().expressRouter;

export { TeachingAssistantControllerRouter as TeachingAssistantController };

export default TeachingAssistantControllerRouter;
