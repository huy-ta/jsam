import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import Login from 'Screens/Auth/Login';
import NotFound from 'Screens/NotFound';
import Dashboard from 'Screens/Dashboard';
import AddRegistrationCode from 'Screens/RegistrationCode/AddRegistrationCode';
import FindRegistrationCode from 'Screens/RegistrationCode/FindRegistrationCode';
import AddStudent from 'Screens/Student/AddStudent';
import FindStudent from 'Screens/Student/FindStudent';
import AddTeacher from 'Screens/Teacher/AddTeacher';
import FindTeacher from 'Screens/Teacher/FindTeacher';
import AddRole from 'Screens/Role/AddRole';
import FindRole from 'Screens/Role/FindRole';
import AddStatus from 'Screens/Status/AddStatus';
import FindStatus from 'Screens/Status/FindStatus';
import AddFault from 'Screens/Fault/AddFault';
import FindFault from 'Screens/Fault/FindFault';
import AddClass from 'Screens/Class/AddClass';
import FindClass from 'Screens/Class/FindClass';
import ManageClass from 'Screens/Class/ManageClass';
import AddSubject from 'Screens/Subject/AddSubject';
import FindSubject from 'Screens/Subject/FindSubject';
import AddTeachingAssistant from 'Screens/TeachingAssistant/AddTeachingAssistant';
import FindTeachingAssistant from 'Screens/TeachingAssistant/FindTeachingAssistant';
import AddRoom from 'Screens/Room/AddRoom';
import FindRoom from 'Screens/Room/FindRoom';
import AddTest from 'Screens/Test/AddTest';
import FindTest from 'Screens/Test/FindTest';
import AddCourse from 'Screens/Course/AddCourse';
import FindCourse from 'Screens/Course/FindCourse';
import Register from 'Screens/Auth/Register';
import Layout from 'Shells/Layout';

import PrivateRoute from './PrivateRoute';

// import PrivateRoleRoute from './PrivateRoleRoute';
import PublicRoute from './PublicRoute';

import { APP_LINKS } from './appLinks';
// import { USER_ROLES } from '../enums/userRoles';

const history = createHistory();

const AppLayout = () => (
  <Layout>
    <Switch>
      <PrivateRoute path={APP_LINKS.DASHBOARD} component={Dashboard} exact />
      <PrivateRoute path={APP_LINKS.ADD_REGISTRATION_CODE} component={AddRegistrationCode} exact />
      <PrivateRoute path={APP_LINKS.FIND_REGISTRATION_CODE} component={FindRegistrationCode} exact />
      <PrivateRoute path={APP_LINKS.ADD_STUDENT} component={AddStudent} exact />
      <PrivateRoute path={APP_LINKS.FIND_STUDENT} component={FindStudent} exact />
      <PrivateRoute path={APP_LINKS.ADD_ROLE} component={AddRole} exact />
      <PrivateRoute path={APP_LINKS.FIND_ROLE} component={FindRole} exact />
      <PrivateRoute path={APP_LINKS.ADD_STATUS} component={AddStatus} exact />
      <PrivateRoute path={APP_LINKS.FIND_STATUS} component={FindStatus} exact />
      <PrivateRoute path={APP_LINKS.ADD_FAULT} component={AddFault} exact />
      <PrivateRoute path={APP_LINKS.FIND_FAULT} component={FindFault} exact />
      <PrivateRoute path={APP_LINKS.ADD_CLASS} component={AddClass} exact />
      <PrivateRoute path={APP_LINKS.FIND_CLASS} component={FindClass} exact />
      <PrivateRoute path={APP_LINKS.MANAGE_CLASS} component={ManageClass} exact />
      <PrivateRoute path={APP_LINKS.ADD_TEACHER} component={AddTeacher} exact />
      <PrivateRoute path={APP_LINKS.FIND_TEACHER} component={FindTeacher} exact />
      <PrivateRoute path={APP_LINKS.ADD_SUBJECT} component={AddSubject} exact />
      <PrivateRoute path={APP_LINKS.FIND_SUBJECT} component={FindSubject} exact />
      <PrivateRoute path={APP_LINKS.ADD_TEACHING_ASSISTANT} component={AddTeachingAssistant} exact />
      <PrivateRoute path={APP_LINKS.FIND_TEACHING_ASSISTANT} component={FindTeachingAssistant} exact />
      <PrivateRoute path={APP_LINKS.ADD_ROOM} component={AddRoom} exact />
      <PrivateRoute path={APP_LINKS.FIND_ROOM} component={FindRoom} exact />
      <PrivateRoute path={APP_LINKS.ADD_TEST} component={AddTest} exact />
      <PrivateRoute path={APP_LINKS.FIND_TEST} component={FindTest} exact />
      <PrivateRoute path={APP_LINKS.ADD_COURSE} component={AddCourse} exact />
      <PrivateRoute path={APP_LINKS.FIND_COURSE} component={FindCourse} exact />
      <PrivateRoute component={NotFound} />
    </Switch>
  </Layout>
);

const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <PublicRoute path={APP_LINKS.LOGIN} component={Login} exact />
      <PublicRoute path={APP_LINKS.REGISTER} component={Register} exact />
      <PrivateRoute path={APP_LINKS.MAIN} component={AppLayout} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

export { history, AppRouter };

export default AppRouter;
