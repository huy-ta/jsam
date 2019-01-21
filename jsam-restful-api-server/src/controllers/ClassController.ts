import express, { Request, Response, Router, NextFunction } from 'express';

// import { validateCreateStudentRequest } from '../helpers/validators/createStudentRequestValidator';
import { ClassModel } from '../models/Class';
import { CourseModel } from '../models/Course';
import { StudyPhaseModel } from '../models/StudyPhase';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import { HTTPStatus } from '../enums/HTTPStatusEnum';
import { StudySessionModel } from '../models/StudySession';

class ClassController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllClasses);
    this.expressRouter.get('/:_id', this.getClassById);
    this.expressRouter.post('', this.createClass);
    this.expressRouter.put('/:_id', this.updateClassById);
    this.expressRouter.delete('/:_id', this.deleteClassById);

    this.expressRouter.post('/:_id/study-phases', this.addStudyPhaseToClass);
  };

  private getAllClasses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let classes = await ClassModel.find();

      classes = await Promise.all(
        classes.map(async foundClass => {
          foundClass.phases = await Promise.all(
            foundClass.phases.map(async phase => {
              const foundPhase = await StudyPhaseModel.findOne({ _id: phase.phaseId });
              const phaseTemp = { ...phase };
              phaseTemp.startDate = foundPhase.startDate;
              phaseTemp.endDate = foundPhase.endDate;
              phaseTemp.name = foundPhase.name;
              return phaseTemp;
            })
          );
          return foundClass;
        })
      );

      const details = { classes };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all classes.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getClassById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const foundClass = await ClassModel.findOne({ _id });

      if (foundClass) {
        foundClass.phases = await Promise.all(
          foundClass.phases.map(async phase => {
            const foundPhase = await StudyPhaseModel.findOne({ _id: phase.phaseId });
            const phaseTemp = { ...phase };
            phaseTemp.startDate = foundPhase.startDate;
            phaseTemp.endDate = foundPhase.endDate;
            phaseTemp.name = foundPhase.name;
            return phaseTemp;
          })
        );

        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got class.', foundClass);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Class not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Class not found.', errors);
        res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createClass = async (req: Request, res: Response, next: NextFunction) => {
    const { name, course: courseId, normalSchedule } = req.body;

    try {
      const foundCourse = await CourseModel.findOne({ _id: courseId });

      const newClass = new ClassModel({
        name,
        course: {
          courseId,
          name: foundCourse.name
        },
        normalSchedule,
        phases: []
      });

      const savedClass = await newClass.save();

      const tempCourseClasses = [...foundCourse.classes, savedClass._id];
      foundCourse.classes = tempCourseClasses;
      await foundCourse.save();

      const apiResponse = new ApiResponse(true, 'Successfully created class.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateClassById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const { name, normalSchedule, level } = req.body;

      let fieldsToBeUpdated = getNullFilteredAndDotifiedObject({
        name,
        normalSchedule,
        level
      });

      await ClassModel.findOneAndUpdate({ _id }, fieldsToBeUpdated);

      const apiResponse = new ApiResponse(true, 'Updated class successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private addStudyPhaseToClass = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { name, startDate, numOfSessions, phaseFee } = reqBody;

    try {
      let foundClass = await ClassModel.findOne({ _id });

      let newStudyPhase = new StudyPhaseModel({
        name,
        startDate,
        teachers: [],
        teachingAssistants: [],
        students: [],
        phaseFee
      });

      for (let i = 0; i < numOfSessions; i++) {
        const newStudySession = new StudySessionModel({
          name: `Session ${i + 1}`
        });

        await newStudySession.save();

        newStudyPhase.sessions = [...newStudyPhase.sessions, newStudySession];
      }

      if (foundClass.phases.length > 0) {
        const lastStudyPhase = foundClass.phases[foundClass.phases.length - 1];
        const foundStudyPhase = await StudyPhaseModel.findOne({ _id: lastStudyPhase.phaseId });
        newStudyPhase.teachers = foundStudyPhase.teachers;
        newStudyPhase.teachingAssistants = foundStudyPhase.teachingAssistants;
        newStudyPhase.students = foundStudyPhase.students;
      }

      await newStudyPhase.save();

      const denormalizedNewStudyPhase = {
        phaseId: newStudyPhase._id,
        name: newStudyPhase.name,
        startDate: newStudyPhase.startDate
      };

      foundClass.phases = [...foundClass.phases, denormalizedNewStudyPhase];

      foundClass.markModified('phases');

      await foundClass.save();

      const apiResponse = new ApiDetailResponse(true, 'Successfully added study phase to class.', {
        newClass: foundClass
      });
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteClassById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const deleteClass = await ClassModel.findOneAndDelete({ _id });

      const course = await CourseModel.findById(deleteClass.course);

      const newClass = course.classes.filter(classId => classId !== _id);
      course.classes = newClass;
      await course.save();

      const apiResponse = new ApiResponse(true, 'Deleted class successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };
}

const ClassControllerRouter = new ClassController().expressRouter;

export { ClassControllerRouter as ClassController };

export default ClassControllerRouter;
