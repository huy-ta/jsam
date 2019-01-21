import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateStudentRequest } from '../helpers/validators/createStudentRequestValidator';
import { TeacherModel } from '../models/Teacher';
import { ICreateTeacherRequest } from '../views/request/ICreateTeacherRequest';
import { IUpdateTeacherRequest } from '../views/request/IUpdateTeacherRequest';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import { SubjectModel } from '../models/Subject';
import { denormAllStudyPhaseTeachers } from '../services/studyPhaseService';

class TeacherController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllTeachers);
    this.expressRouter.get('/:_id', this.getTeacherById);
    this.expressRouter.get('/email/:email', this.getTeacherByEmail);
    this.expressRouter.post('', validateCreateStudentRequest, this.createTeacher);
    this.expressRouter.put('/:_id', this.updateTeacherById);
    this.expressRouter.put('/email/:email', this.updateTeacherByEmail);
    this.expressRouter.delete('/:_id', this.deleteTeacherById);
  };

  private getAllTeachers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teachers = await TeacherModel.find().populate({
        path: 'speciality',
        select: 'name'
      });
      const details = { teachers };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all teachers.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getTeacherById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const teacher = await TeacherModel.findOne({ _id }).populate({
        path: 'speciality',
        select: 'name'
      });

      if (teacher) {
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got Teacher.', teacher);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Teacher not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Teacher not found.', errors);
        res.status(404).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private getTeacherByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;
      const teacher = await TeacherModel.findOne({ email }).populate({
        path: 'speciality',
        select: 'name'
      });

      if (teacher) {
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got Teacher.', teacher);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Teacher not found with id '${email}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Teacher not found.', errors);
        res.status(404).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createTeacher = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ICreateTeacherRequest = req.body;

    const { name, dateOfBirth, email, facebook, gender, phone, speciality } = reqBody;

    try {
      if (speciality !== '') {
        const newTeacher = new TeacherModel({
          name,
          gender,
          dateOfBirth,
          email,
          facebook,
          phone,
          speciality
        });
        
        const teacher = await newTeacher.save();

        const subject = await SubjectModel.findById(speciality);

        const listTeacher = [...subject.teachers, teacher._id];

        await SubjectModel.findByIdAndUpdate(speciality, {
          teachers: listTeacher
        });
      } else {
        const newTeacher = new TeacherModel({
          name,
          gender,
          dateOfBirth,
          email,
          facebook,
          phone
        });

        await newTeacher.save();
      }
      const apiResponse = new ApiResponse(true, 'Successfully created teacher.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateTeacherById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const reqBody: IUpdateTeacherRequest = req.body;

      const { name, dateOfBirth, email, facebook, gender, phone, speciality } = reqBody;

      const foundTeacher = await TeacherModel.findById(_id);

      // Check if the speciality field is going to be updated
      if (`${foundTeacher.speciality}` !== `${speciality}`) {
        // Check if the teacher's speciality field is set
        if (foundTeacher.speciality) {
          // If it is set and is going to be updated to another value, remove
          // the teacher from that subject's teacher list.
          const foundSubject = await SubjectModel.findById(foundTeacher.speciality);
          const newTeachers = foundSubject.teachers.filter(teacherId => teacherId.toString() !== _id.toString());
          foundSubject.teachers = newTeachers;

          await foundSubject.save();
        }

        // Check if the speciality field in the request body is not null or undefined
        if (speciality) {
          // If it is not null or undefined, find the equivalent subject and add the
          // teacher to its teacher list.
          const foundSubject = await SubjectModel.findById(speciality);
          const newTeacherOfSubject = [...foundSubject.teachers, _id];
          foundSubject.teachers = newTeacherOfSubject;

          await foundSubject.save();
        }
      }

      let fieldsToBeUpdated: IUpdateTeacherRequest = getNullFilteredAndDotifiedObject({
        name,
        gender,
        dateOfBirth,
        email,
        facebook,
        phone,
        speciality
      });

      let isNameUpdated = false;
      if (name !== foundTeacher.name) {
        isNameUpdated = true;
      }

      await foundTeacher.update(fieldsToBeUpdated);

      // If teacher's name is updated, then update all the denormalized name values in
      // other documents.
      if (isNameUpdated) {
        await denormAllStudyPhaseTeachers(_id);
      }

      const apiResponse = new ApiResponse(true, 'Updated teacher successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateTeacherByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;

      const reqBody: IUpdateTeacherRequest = req.body;

      const { name, dateOfBirth, facebook, gender, phone } = reqBody;

      const foundTeacher = await TeacherModel.findOne({email});

      

      let fieldsToBeUpdated: IUpdateTeacherRequest = getNullFilteredAndDotifiedObject({
        name,
        gender,
        dateOfBirth,
        email,
        facebook,
        phone
      });

      let isNameUpdated = false;
      if (name !== foundTeacher.name) {
        isNameUpdated = true;
      }

      await foundTeacher.update(fieldsToBeUpdated);

      // If teacher's name is updated, then update all the denormalized name values in
      // other documents.
      if (isNameUpdated) {
        await denormAllStudyPhaseTeachers(email);
      }

      const apiResponse = new ApiResponse(true, 'Updated teacher successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteTeacherById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const teacher = await TeacherModel.findOneAndDelete({ _id });

      const foundSubject = await SubjectModel.findById(teacher.speciality);

      const newSubjectTeachers = foundSubject.teachers.filter(id => id.toString() !== teacher.speciality.toString());

      foundSubject.teachers = newSubjectTeachers;
      await foundSubject.save();

      const apiResponse = new ApiResponse(true, 'Deleted teacher successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };
}

const TeacherControllerRouter = new TeacherController().expressRouter;

export { TeacherControllerRouter as TeacherController };

export default TeacherControllerRouter;
