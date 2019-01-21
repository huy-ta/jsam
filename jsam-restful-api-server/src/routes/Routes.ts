import { Application } from 'express';
import { AuthController } from '../controllers/AuthController';
import { RegistrationCodeController } from '../controllers/RegistrationCodeController';
import { StudentController } from '../controllers/StudentController';
import { TeacherController } from '../controllers/TeacherController';
import { RoleController } from '../controllers/RoleController';
import { FaultController } from '../controllers/FaultController';
import { StatusController } from '../controllers/StatusController';
import { ClassController } from '../controllers/ClassController';
import { TeachingAssistantController } from '../controllers/TeachingAssistantController';
import { RoomController } from '../controllers/RoomController';
import { SubjectController } from '../controllers/SubjectController';
import { CourseController } from '../controllers/CourseController';
import { StudyPhaseController } from '../controllers/StudyPhaseController';
import { StudySessionController } from '../controllers/StudySessionController';
import { TestController } from '../controllers/TestController';

class Routes {
  public routes(expressApp: Application): void {
    const routeRootPrefix: string = '/api';

    expressApp.use(`${routeRootPrefix}/auth`, AuthController);
    expressApp.use(
      `${routeRootPrefix}/registration-codes`,
      RegistrationCodeController
    );
    expressApp.use(`${routeRootPrefix}/roles`, RoleController);
    expressApp.use(`${routeRootPrefix}/status`, StatusController);
    expressApp.use(`${routeRootPrefix}/students`, StudentController);
    expressApp.use(`${routeRootPrefix}/teachers`, TeacherController);
    expressApp.use(`${routeRootPrefix}/subjects`, SubjectController);
    expressApp.use(`${routeRootPrefix}/classes`, ClassController);
    expressApp.use(
      `${routeRootPrefix}/teaching-assistants`,
      TeachingAssistantController
    );
    expressApp.use(`${routeRootPrefix}/rooms`, RoomController);
    expressApp.use(`${routeRootPrefix}/courses`, CourseController);
    expressApp.use(`${routeRootPrefix}/faults`, FaultController);
    expressApp.use(`${routeRootPrefix}/study-phases`, StudyPhaseController);
    expressApp.use(`${routeRootPrefix}/study-sessions`, StudySessionController);
    expressApp.use(`${routeRootPrefix}/tests`, TestController);
  }
}

export { Routes };

export default Routes;
