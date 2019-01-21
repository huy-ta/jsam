import express, { Request, Response, Router, NextFunction } from 'express';

import { StudyPhaseModel } from '../models/StudyPhase';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import { TeacherModel } from '../models/Teacher';
import { RoleModel } from '../models/Role';
import { StudySessionModel } from '../models/StudySession';
import { StudentModel } from '../models/Student';
import { FaultModel } from '../models/Fault';
import {
  denormStudyPhaseTeachers,
  denormStudyPhaseTeachingAssistants,
  denormStudyPhaseStudents,
  denormNewlyAddedTeachers,
  denormNewlyAddedStudents,
  denormNewlyAddedTeachingAssistants
} from '../services/studyPhaseService';
import { HTTPStatus } from '../enums/HTTPStatusEnum';

class StudyPhaseController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllStudyPhases);
    this.expressRouter.get('/:_id', this.getStudyPhaseById);
    this.expressRouter.post('', this.createStudyPhase);
    this.expressRouter.put('/:_id', this.updateStudyPhaseById);
    this.expressRouter.delete('/:_id', this.deleteStudyPhaseById);

    this.expressRouter.post('/:_id/teachers', this.addStudyPhaseTeachers);
    this.expressRouter.put('/:_id/teachers', this.setStudyPhaseTeachers);
    this.expressRouter.delete('/:_id/teachers', this.deleteStudyPhaseTeachers);

    this.expressRouter.post('/:_id/teaching-assistants', this.addStudyPhaseTeachingAssistants);
    this.expressRouter.put('/:_id/teaching-assistants', this.setStudyPhaseTeachingAssistants);
    this.expressRouter.delete('/:_id/teaching-assistants', this.deleteStudyPhaseTeachingAssistants);

    this.expressRouter.get('/:_id/summary', this.getStudyPhaseSummaryById);

    this.expressRouter.post('/:_id/students', this.addStudyPhaseStudents);
    this.expressRouter.put('/:_id/students', this.setStudyPhaseStudents);
    this.expressRouter.put('/:_id/students/:studentId', this.updateStudentFee);
    this.expressRouter.delete('/:_id/students', this.deleteStudyPhaseStudents);

    this.expressRouter.put('/:phaseId/study-sessions/:sessionId', this.activateStudySession);
  };

  private activateStudySession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phaseId, sessionId: reqSessionId } = req.params;

      const foundPhase = await StudyPhaseModel.findOne({ _id: phaseId });

      const foundSession = await StudySessionModel.findOne({ _id: reqSessionId });

      foundSession.attendance = {
        teachers: [],
        teachingAssistants: [],
        students: []
      };

      foundPhase.teachers.forEach(teacher => {
        const newTeacherAttendance = {
          teacherId: teacher.teacherId
        };
        foundSession.attendance.teachers = [...foundSession.attendance.teachers, newTeacherAttendance];
      });

      foundPhase.teachingAssistants.forEach(teachingAssistant => {
        const newAssistantAttendance = {
          teachingAssistantId: teachingAssistant.teachingAssistantId
        };
        foundSession.attendance.teachingAssistants = [
          ...foundSession.attendance.teachingAssistants,
          newAssistantAttendance
        ];
      });

      foundPhase.students.forEach(student => {
        const newStudentAttendance = {
          studentId: student.studentId
        };
        foundSession.attendance.students = [...foundSession.attendance.students, newStudentAttendance];
      });

      foundSession.activated = true;

      foundSession.markModified('attendance');

      await foundSession.save();

      const details = { session: foundSession };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully activated study session.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getAllStudyPhases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let studyPhases = await StudyPhaseModel.find();

      const details = { studyPhases };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all study phases.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getStudyPhaseById = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    try {
      let foundStudyPhase = await StudyPhaseModel.findOne({ _id }).populate('sessions');

      const details = { foundStudyPhase };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got study phase.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private createStudyPhase = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody = req.body;

    const { name, startDate, sessions, phaseFee } = reqBody;

    try {
      const newStudyPhase = new StudyPhaseModel({
        name,
        startDate,
        teachers: [],
        teachingAssistants: [],
        students: [],
        sessions,
        phaseFee
      });

      await newStudyPhase.save();

      const apiResponse = new ApiResponse(true, 'Successfully created study phase.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateStudyPhaseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const reqBody = req.body;

      const { name, startDate, endDate, phaseFee, sessions } = reqBody;

      let fieldsToBeUpdated = getNullFilteredAndDotifiedObject({
        name,
        startDate,
        endDate,
        phaseFee,
        sessions
      });

      // FIXME: Denormalized update

      await StudyPhaseModel.findOneAndUpdate({ _id }, fieldsToBeUpdated);

      const apiResponse = new ApiResponse(true, 'Updated study phase successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateStudentFee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id, studentId } = req.params;

      const reqBody = req.body;

      const { paidFee } = reqBody;

      const foundStudyPhase = await StudyPhaseModel.findOne({ _id });

      foundStudyPhase.students = foundStudyPhase.students.map(student => {
        let studentTemp = { ...student };
        if (studentTemp.studentId === studentId) {
          studentTemp.paidFee = paidFee;
        }
        return studentTemp;
      });

      foundStudyPhase.markModified('students');

      await foundStudyPhase.save();

      const apiResponse = new ApiResponse(true, 'Updated student fees successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteStudyPhaseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      await StudyPhaseModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted study phase successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private addStudyPhaseTeachers = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { teachers } = reqBody;

    try {
      const foundStudyPhase = await StudyPhaseModel.findOne({ _id });

      let isThereDuplicatedTeacher = false;
      teachers.forEach(reqTeacher => {
        if (foundStudyPhase.teachers.find(foundTeacher => foundTeacher.teacherId === reqTeacher.teacherId)) {
          isThereDuplicatedTeacher = true;
          const errors = {
            teachers: `Duplicated teacherId: ${reqTeacher.teacherId}`
          };
          const apiErrorResponse = new ApiErrorResponse(false, "Couldn't add teachers to study phase.", errors);
          return res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
        }
      });

      if (!isThereDuplicatedTeacher) {
        foundStudyPhase.teachers = [...foundStudyPhase.teachers, ...teachers];

        await denormNewlyAddedTeachers(foundStudyPhase, teachers.length);

        await foundStudyPhase.save();

        const apiResponse = new ApiResponse(true, 'Added teacher(s) to study phase successfully.');
        res.json(apiResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private deleteStudyPhaseTeachers = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { teacherIds } = reqBody;

    try {
      const foundStudyPhase = await StudyPhaseModel.findOne({ _id });

      teacherIds.forEach(reqTeacherId => {
        foundStudyPhase.teachers = foundStudyPhase.teachers.filter(
          foundTeacher => foundTeacher.teacherId !== reqTeacherId
        );
      });

      await foundStudyPhase.save();

      const apiResponse = new ApiResponse(true, 'Deleted teacher(s) from study phase successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private setStudyPhaseTeachers = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { teachers } = reqBody;

    try {
      const foundStudyPhase = await StudyPhaseModel.findOne({ _id });

      foundStudyPhase.teachers = teachers;

      await denormStudyPhaseTeachers(foundStudyPhase);

      await foundStudyPhase.save();

      const apiResponse = new ApiResponse(true, "Updated study phase's teachers successfully.");
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private addStudyPhaseTeachingAssistants = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { teachingAssistants } = reqBody;

    try {
      const foundStudyPhase = await StudyPhaseModel.findOne({ _id });

      let isThereDuplicatedTeachingAssistant = false;
      teachingAssistants.forEach(reqTeachingAssistant => {
        if (
          foundStudyPhase.teachingAssistants.find(
            foundTeachingAssistant =>
              foundTeachingAssistant.teachingAssistantId === reqTeachingAssistant.teachingAssistantId
          )
        ) {
          isThereDuplicatedTeachingAssistant = true;
          const errors = {
            teachingAssistants: `Duplicated teachingAssistantId: ${reqTeachingAssistant.teachingAssistantId}`
          };
          const apiErrorResponse = new ApiErrorResponse(
            false,
            "Couldn't add teaching assistant(s) to study phase.",
            errors
          );
          return res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
        }
      });

      if (!isThereDuplicatedTeachingAssistant) {
        foundStudyPhase.teachingAssistants = [...foundStudyPhase.teachingAssistants, ...teachingAssistants];

        await denormNewlyAddedTeachingAssistants(foundStudyPhase, teachingAssistants.length);

        await foundStudyPhase.save();

        const apiResponse = new ApiResponse(true, 'Added teaching assistant(s) to study phase successfully.');
        res.json(apiResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private deleteStudyPhaseTeachingAssistants = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { teachingAssistantIds } = reqBody;

    try {
      const foundStudyPhase = await StudyPhaseModel.findOne({ _id });

      teachingAssistantIds.forEach(reqTeachingAssistantId => {
        foundStudyPhase.teachingAssistants = foundStudyPhase.teachingAssistants.filter(
          foundTeachingAssistant => foundTeachingAssistant.teachingAssistantId !== reqTeachingAssistantId
        );
      });

      await foundStudyPhase.save();

      const apiResponse = new ApiResponse(true, 'Deleted teaching assistant(s) from study phase successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private setStudyPhaseTeachingAssistants = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { teachingAssistants } = reqBody;

    try {
      const foundStudyPhase = await StudyPhaseModel.findOne({ _id });

      foundStudyPhase.teachingAssistants = teachingAssistants;

      await denormStudyPhaseTeachingAssistants(foundStudyPhase);

      await foundStudyPhase.save();

      const apiResponse = new ApiResponse(true, "Updated study phase's teaching assistants successfully.");
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private addStudyPhaseStudents = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { students } = reqBody;

    try {
      const foundStudyPhase = await StudyPhaseModel.findOne({ _id });

      let isThereDuplicatedStudent = false;
      students.forEach(reqStudent => {
        if (foundStudyPhase.students.find(foundStudent => foundStudent.studentId === reqStudent.studentId)) {
          isThereDuplicatedStudent = true;
          const errors = {
            students: `Duplicated studentId: ${reqStudent.studentId}`
          };
          const apiErrorResponse = new ApiErrorResponse(false, "Couldn't add students to study phase.", errors);
          return res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
        }
      });

      if (!isThereDuplicatedStudent) {
        foundStudyPhase.students = [...foundStudyPhase.students, ...students];

        await denormNewlyAddedStudents(foundStudyPhase, students.length);

        await foundStudyPhase.save();

        const apiResponse = new ApiResponse(true, 'Added student(s) to study phase successfully.');
        res.json(apiResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private deleteStudyPhaseStudents = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { studentIds } = reqBody;

    try {
      const foundStudyPhase = await StudyPhaseModel.findOne({ _id });

      studentIds.forEach(reqStudentId => {
        foundStudyPhase.students = foundStudyPhase.students.filter(
          foundStudent => foundStudent.studentId !== reqStudentId
        );
      });

      await foundStudyPhase.save();

      const apiResponse = new ApiResponse(true, 'Deleted student(s) from study phase successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private setStudyPhaseStudents = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { students } = reqBody;

    try {
      const foundStudyPhase = await StudyPhaseModel.findOne({ _id });

      foundStudyPhase.students = students;

      await denormStudyPhaseStudents(foundStudyPhase);

      await foundStudyPhase.save();

      const apiResponse = new ApiResponse(true, "Updated study phase's students successfully.");
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private getStudyPhaseSummaryById = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const foundStudyPhase = await StudyPhaseModel.findOne({ _id });
    let foundTests = [];
    let foundStudentFault = [];

    await Promise.all(
      foundStudyPhase.sessions.map(async sessionId => {
        const foundSession = await StudySessionModel.findOne({ _id: sessionId });
        if (foundSession.test) {
          const studentMark = foundSession.attendance.students;
          foundTests.push({
            name: foundSession.test.name,
            totalMark: foundSession.test.totalMarks,
            studentMark
          });
        }
        const sessionFaults = foundSession.attendance.students.map(student => {
          if (student.faults) {
            return {
              studentId: student.studentId,
              fault: student.faults
            };
          }
        });
        foundStudentFault.push(sessionFaults);
      })
    );

    const foundFault = await FaultModel.find();
    const faults = foundFault.map(fault => {
      return {
        id: fault._id,
        name: fault.name,
        count: 0
      };
    });

    const studentStatistics = foundStudyPhase.students.map(student => {
      let studentMark = foundTests.map(test => {
        const testMark = test.studentMark.filter(mark => mark.studentId === student.studentId);
        return {
          testName: test.name,
          totalMark: test.totalMark,
          testMark: (testMark[0].testMark / test.totalMark) * 10
        };
      });

      let getTotalMark = 0;

      studentMark.forEach(mark => {
        getTotalMark += mark.testMark;
      });

      let averageMark = getTotalMark / studentMark.length;

      const studentFault = faults.map(fault => {
        let count = 0;
        foundStudentFault.forEach(found => {
          found.forEach(session => {
            if (session !== undefined && session.studentId === student.studentId) {
              session.fault.forEach(element => {
                if (element.toString() === fault.id.toString()) {
                  count++;
                }
              });
            }
          });
        });
        return {
          id: fault.id,
          name: fault.name,
          count
        };
      });

      return {
        id: student.studentId,
        name: student.studentName,
        faults: studentFault,
        tests: studentMark,
        averageMark,
        rank: 0
      };
    });

    studentStatistics.sort((a, b) => {
      return b.averageMark - a.averageMark;
    });

    studentStatistics.forEach(student => {
      student.rank = studentStatistics.indexOf(student) + 1;
    });

    const apiDetailResponse = new ApiDetailResponse(true, 'Successful get summary of study phase.', studentStatistics);

    res.json(apiDetailResponse);
  };
}

const StudyPhaseControllerRouter = new StudyPhaseController().expressRouter;

export { StudyPhaseControllerRouter as StudyPhaseController };

export default StudyPhaseControllerRouter;
