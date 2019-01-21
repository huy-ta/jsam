import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateStudentRequest } from '../helpers/validators/createStudentRequestValidator';
import { SubjectModel } from '../models/Subject';
import { ICreateSubjectRequest } from '../views/request/ICreateSubjectRequest';
import { IUpdateSubjectRequest } from '../views/request/IUpdateSubjectRequest';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import Teacher, { TeacherModel } from '../models/Teacher';

class SubjectController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllSubjects);
    this.expressRouter.get('/:_id', this.getSubjectById);
    this.expressRouter.post('', this.createSubject);
    this.expressRouter.put('/:_id', this.updateSubjectById);
    this.expressRouter.delete('/:_id', this.deleteSubjectById);
  };

  private getAllSubjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subjects = await SubjectModel.find().populate('teachers');
      const details = { subjects };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all Subjects.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const subject = await SubjectModel.findOne({ _id }).populate('teachers');

      if (subject) {
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got subject.', subject);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Subject not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Subject not found.', errors);
        res.status(404).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createSubject = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ICreateSubjectRequest = req.body;

    const { name, teachers } = reqBody;

    try {
      const newSubject = new SubjectModel({
        name,
        teachers
      });

      const subject = await newSubject.save();
      
      subject.teachers.map(async teacher => {
        await Teacher.findByIdAndUpdate(teacher, { speciality: subject._id });
      });

      const apiResponse = new ApiResponse(true, 'Successfully created subject.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateSubjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const reqBody: IUpdateSubjectRequest = req.body;

      const { name, teachers } = reqBody;

      let fieldsToBeUpdated: IUpdateSubjectRequest = getNullFilteredAndDotifiedObject({
        name,
        teachers
      });

      await SubjectModel.findOneAndUpdate({ _id }, fieldsToBeUpdated);

      const apiResponse = new ApiResponse(true, 'Updated subject successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteSubjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      TeacherModel.find({ speciality: _id }, (err, teachers) => {
        teachers.forEach(async teacher => {
          teacher.speciality = undefined;
          await teacher.save();
        });
      });

      await SubjectModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted subject successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };
}

const SubjectControllerRouter = new SubjectController().expressRouter;

export { SubjectControllerRouter as SubjectController };

export default SubjectControllerRouter;
