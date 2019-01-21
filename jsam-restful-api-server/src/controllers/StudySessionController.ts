import express, { Request, Response, Router, NextFunction } from 'express';

import { StudySessionModel } from '../models/StudySession';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import { TeacherModel } from '../models/Teacher';
import { TeachingAssistantModel } from '../models/TeachingAssistant';
import { RoleModel } from '../models/Role';
import { FaultModel } from '../models/Fault';
import { HTTPStatus } from '../enums/HTTPStatusEnum';
import StudentModel from '../models/Student';

class StudySessionController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllStudySessions);
    this.expressRouter.get('/:_id', this.getStudySessionById);
    this.expressRouter.put('/:_id', this.updateStudySessionById);
    this.expressRouter.put('/:_id/attendance/teachers/:teacherId', this.updateTeacherAttendance);
    this.expressRouter.put(
      '/:_id/attendance/teaching-assistants/:teachingAssistantId',
      this.updateTeachingAssistantAttendance
    );
    this.expressRouter.put('/:_id/attendance/students/:studentId', this.updateStudentAttendance);
    // this.expressRouter.get('/:_id/summary', this.getStudySessionSummaryById);
    this.expressRouter.post('/:_id/summary', this.createStudySessionSummaryById);
    this.expressRouter.delete('/:_id', this.deleteStudySessionById);
  };

  private getAllStudySessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let studySessions = await StudySessionModel.find();

      const details = { studySessions };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all study sessions.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getStudySessionById = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    try {
      let foundStudySession = await StudySessionModel.findOne({ _id });

      foundStudySession.attendance.students = await Promise.all(
        foundStudySession.attendance.students.map(async student => {
          const foundStudent = await StudentModel.findOne({ _id: student.studentId });
          const studentTemp = { ...student };
          studentTemp.studentId = foundStudent;
          return studentTemp;
        })
      );

      foundStudySession.attendance.teachers = await Promise.all(
        foundStudySession.attendance.teachers.map(async teacher => {
          const foundTeacher = await TeacherModel.findOne({ _id: teacher.teacherId });
          const teacherTemp = { ...teacher };
          teacherTemp.teacherId = foundTeacher;
          return teacherTemp;
        })
      );

      foundStudySession.attendance.teachingAssistants = await Promise.all(
        foundStudySession.attendance.teachingAssistants.map(async teachingAssistant => {
          const foundTeachingAssistant = await TeachingAssistantModel.findOne({
            _id: teachingAssistant.teachingAssistantId
          });
          const teachingAssistantTemp = { ...teachingAssistant };
          teachingAssistantTemp.teachingAssistantId = foundTeachingAssistant;
          return teachingAssistantTemp;
        })
      );

      const details = { foundStudySession };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got study session.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateStudySessionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const reqBody = req.body;

      const { startTime, endTime, room, date } = reqBody;

      let fieldsToBeUpdated = getNullFilteredAndDotifiedObject({
        startTime,
        endTime,
        room,
        date
      });

      await StudySessionModel.findOneAndUpdate({ _id }, fieldsToBeUpdated);

      const apiResponse = new ApiResponse(true, 'Updated study session successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateStudentAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id, studentId } = req.params;

      const reqBody = req.body;

      const { present, faults } = reqBody;

      const foundStudySession = await StudySessionModel.findOne({ _id });

      foundStudySession.attendance.students = foundStudySession.attendance.students.map(student => {
        let studentTemp = { ...student };
        if (student.studentId === studentId) {
          if (present) {
            studentTemp.present = present;
          }
          if (faults) {
            studentTemp.faults = faults;
          }
        }
        return studentTemp;
      });

      foundStudySession.markModified('attendance');

      await foundStudySession.save();

      const apiResponse = new ApiResponse(true, 'Updated student attendance successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateTeacherAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id, teacherId } = req.params;

      const reqBody = req.body;

      const { present, faults } = reqBody;

      const foundStudySession = await StudySessionModel.findOne({ _id });

      foundStudySession.attendance.teachers = foundStudySession.attendance.teachers.map(teacher => {
        let teacherTemp = { ...teacher };
        if (teacher.teacherId === teacherId) {
          if (present) {
            teacherTemp.present = present;
          }
          if (faults) {
            teacherTemp.faults = faults;
          }
        }
        return teacherTemp;
      });

      foundStudySession.markModified('attendance');

      await foundStudySession.save();

      const apiResponse = new ApiResponse(true, 'Updated teacher attendance successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateTeachingAssistantAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id, teachingAssistantId } = req.params;

      const reqBody = req.body;

      const { present, faults } = reqBody;

      const foundStudySession = await StudySessionModel.findOne({ _id });

      foundStudySession.attendance.teachingAssistants = foundStudySession.attendance.teachingAssistants.map(
        teachingAssistant => {
          let teachingAssistantTemp = { ...teachingAssistant };
          if (teachingAssistant.teachingAssistantId === teachingAssistantId) {
            if (present) {
              teachingAssistantTemp.present = present;
            }
            if (faults) {
              teachingAssistantTemp.faults = faults;
            }
          }
          return teachingAssistantTemp;
        }
      );

      foundStudySession.markModified('attendance');

      await foundStudySession.save();

      const apiResponse = new ApiResponse(true, 'Updated teaching assistant attendance successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteStudySessionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      await StudySessionModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted study session successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  // private getStudySessionSummaryById = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { _id } = req.params;
  //     const foundStudySession = await StudySessionModel.findOne({ _id });
  //     const foundFaults = await FaultModel.find();

  //     if (foundStudySession) {
  //       let summaryStudentFaults = foundFaults.map(fault => ({
  //         id: fault._id,
  //         name: fault.name,
  //         students: []
  //       }));

  //       let summaryStudySession = {
  //         fault: summaryStudentFaults,
  //         note: foundStudySession.note,
  //         homework: foundStudySession.homework
  //       };

  //       foundStudySession.attendance.students.forEach(student => {
  //         if (student.faults) {
  //           student.faults.forEach(attendanceStudentFaultId => {
  //             summaryStudentFaults.forEach(summaryStudentFault => {
  //               if (attendanceStudentFaultId.toString() === summaryStudentFault.id.toString()) {
  //                 summaryStudentFaults[summaryStudentFaults.indexOf(summaryStudentFault)].students.push(
  //                   student.studentName
  //                 );
  //               }
  //             });
  //           });
  //         }
  //       });

  //       const apiDetailResponse = new ApiDetailResponse(
  //         true,
  //         'Successfully got study session summary.',
  //         summaryStudySession
  //       );
  //       res.json(apiDetailResponse);
  //     } else {
  //       const errors = {
  //         _id: `Study session not found with id '${_id}'.`
  //       };
  //       const apiErrorResponse = new ApiErrorResponse(false, 'Study session not found.', errors);
  //       res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  private createStudySessionSummaryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const { homework, note } = req.body;
      let foundStudySession = await StudySessionModel.findOne({ _id });

      if (foundStudySession) {
        foundStudySession.homework = homework;
        foundStudySession.note = note;

        await foundStudySession.save();

        const apiDetailResponse = new ApiDetailResponse(
          true,
          'Successfully got study session summary.',
          foundStudySession
        );
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Study session not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Study session not found.', errors);
        res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };
}

const StudySessionControllerRouter = new StudySessionController().expressRouter;

export { StudySessionControllerRouter as StudySessionController };

export default StudySessionControllerRouter;
