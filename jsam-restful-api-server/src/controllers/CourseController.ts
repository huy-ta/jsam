import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateCourseRequest } from '../helpers/validators/createCourseRequestValidator';
import { CourseModel } from '../models/Course';
import { ICreateCourseRequest } from '../views/request/ICreateCourseRequest';
import { IUpdateCourseRequest } from '../views/request/IUpdateCourseRequest';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import { denormAllClassesCourse } from '../services/classService';
import { ClassModel } from '../models/Class';

class CourseController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllCourses);
    this.expressRouter.get('/:_id', this.getCourseById);
    this.expressRouter.post('', validateCreateCourseRequest, this.createCourse);
    this.expressRouter.put('/:_id', this.updateCourseById);
    this.expressRouter.delete('/:_id', this.deleteCourseById);
  };

  private getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let courses = await CourseModel.find().populate('subject classes');
      // console.log(courses);
      // courses = courses.map(course => {
      //   course.classes = course.classes.map(classId => ClassModel.findOne(({ _id: classId })));
      //   return course;
      // })
      const details = { courses };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all courses.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const course = await CourseModel.findOne({ _id }).populate('subject class');

      if (course) {
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got course.', course);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Course not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Course not found.', errors);
        res.status(404).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createCourse = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ICreateCourseRequest = req.body;

    const { name, subject, classes } = reqBody;

    try {
      const newCourse = new CourseModel({
        name,
        subject,
        classes
      });

      await newCourse.save();

      const apiResponse = new ApiResponse(true, 'Successfully created course.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const reqBody: IUpdateCourseRequest = req.body;

      const { name, subject, classes } = reqBody;

      const foundCourse = await CourseModel.findOne({ _id });

      let isNameUpdated = false;
      if (name !== foundCourse.name) {
        isNameUpdated = true;
      }

      let fieldsToBeUpdated: IUpdateCourseRequest = getNullFilteredAndDotifiedObject({
        name,
        subject,
        classes
      });

      const updatedCourse = await CourseModel.findOneAndUpdate({ _id }, fieldsToBeUpdated, { new: true });

      if (isNameUpdated) {
        await denormAllClassesCourse(updatedCourse);
      }

      const apiResponse = new ApiResponse(true, 'Updated course successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      await CourseModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted course successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };
}

const CourseControllerRouter = new CourseController().expressRouter;

export { CourseControllerRouter as CourseController };

export default CourseControllerRouter;
