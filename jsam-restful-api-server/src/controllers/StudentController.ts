import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateStudentRequest } from '../helpers/validators/createStudentRequestValidator';
import { StudentModel } from '../models/Student';
import { ICreateStudentRequest } from '../views/request/ICreateStudentRequest';
import { IUpdateStudentRequest } from '../views/request/IUpdateStudentRequest';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import { HTTPStatus } from '../enums/HTTPStatusEnum';
import { StudentCode } from '../enums/StudentCodeEnum';
import { denormAllStudyPhaseStudents } from '../services/studyPhaseService';
import { StudentCodeModel } from '../models/StudentCode';

class StudentController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllStudents);
    this.expressRouter.get('/:_id', this.getStudentById);
    this.expressRouter.post('', validateCreateStudentRequest, this.createStudent);
    this.expressRouter.put('/:_id', this.updateStudentById);
    this.expressRouter.delete('/:_id', this.deleteStudentById);
    this.expressRouter.delete('', this.bulkDeleteStudentsByIds);
  };

  private getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const students = await StudentModel.find().populate('status');
      const details = { students };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all students.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getStudentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const student = await StudentModel.findOne({ _id })
        .populate('status')
        .exec();

      if (student) {
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got student.', student);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Student not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Student not found.', errors);
        res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createStudent = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ICreateStudentRequest = req.body;

    const { name, gender, school, phone, status } = reqBody;

    try {
      let lastStudentCode = await StudentCodeModel.findOne({ name: StudentCode.LAST_CODE });

      let newLastStudentCodeNum = parseInt(lastStudentCode.code, 10) + 1;

      lastStudentCode.code = newLastStudentCodeNum.toString();

      await lastStudentCode.save();

      const newStudent = new StudentModel({
        name,
        gender,
        school,
        phone,
        status,
        code: lastStudentCode.code
      });

      await newStudent.save();

      const apiResponse = new ApiResponse(true, 'Successfully created student.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateStudentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const reqBody: IUpdateStudentRequest = req.body;

      const { name, gender, school, phone, status } = reqBody;

      let fieldsToBeUpdated: IUpdateStudentRequest = getNullFilteredAndDotifiedObject({
        name,
        gender,
        school,
        phone,
        status
      });

      const foundStudent = await StudentModel.findOne({ _id });

      let isNameUpdated = false;
      if (foundStudent.name !== name) {
        isNameUpdated = true;
      }

      await foundStudent.update(fieldsToBeUpdated);

      if (isNameUpdated) {
        await denormAllStudyPhaseStudents(_id);
      }

      const apiResponse = new ApiResponse(true, 'Updated student successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteStudentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      await StudentModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted student successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private bulkDeleteStudentsByIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqQueryIds = req.query._id;
      let _ids;
      if (typeof reqQueryIds === 'string') {
        _ids = [req.query._id];
      } else {
        _ids = [...reqQueryIds];
      }

      const response = await StudentModel.deleteMany({ _id: { $in: _ids } });
      if (response.n > 0) {
        const apiResponse = new ApiResponse(true, 'Bulk deleted students successfully.');
        res.json(apiResponse);
      } else {
        const errors = {
          _ids: 'Some of the students were not found.'
        };
        const apiErrorResponse = new ApiErrorResponse(true, "Couldn't delete students.", errors);
        res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };
}

const StudentControllerRouter = new StudentController().expressRouter;

export { StudentControllerRouter as StudentController };

export default StudentControllerRouter;
