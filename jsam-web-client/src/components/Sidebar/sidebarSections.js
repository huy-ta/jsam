import React from 'react';

import Add from '@material-ui/icons/Add';
import Search from '@material-ui/icons/Search';
import Class from '@material-ui/icons/Class';
import Dashboard from '@material-ui/icons/Dashboard';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import AccessibilityNew from '@material-ui/icons/AccessibilityNew';
import SignalCellularAlt from '@material-ui/icons/SignalCellularAlt';
import FiberPin from '@material-ui/icons/FiberPin';
import School from '@material-ui/icons/School';
import Subject from '@material-ui/icons/Subject';
import MeetingRoom from '@material-ui/icons/MeetingRoom';
import Person from '@material-ui/icons/Person';
import Manage from '@material-ui/icons/DeviceHub';
import Error from '@material-ui/icons/Error';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import Bookmarks from '@material-ui/icons/Bookmarks';

import { APP_LINKS } from 'Config/routers/appLinks';

const sidebarSections = [
  {
    sectionId: 'overview',
    sectionDisplayName: 'OVERVIEW',
    items: [
      {
        path: APP_LINKS.DASHBOARD,
        codeName: 'dashboard',
        displayName: 'Dashboard',
        icon: () => <Dashboard />
      }
    ]
  },
  {
    sectionId: 'basic-management',
    sectionDisplayName: 'BASIC MANAGEMENT',
    items: [
      {
        codeName: 'registration-code-management',
        displayName: 'Registration Codes',
        icon: () => <FiberPin />,
        children: [
          {
            path: APP_LINKS.ADD_REGISTRATION_CODE,
            codeName: 'add-registration-code',
            displayName: 'Add Registration Code',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_REGISTRATION_CODE,
            codeName: 'find-registration-code',
            displayName: 'Find Registration Code',
            icon: () => <Search />
          }
        ],
        expanded: false
      },
      {
        codeName: 'student-management',
        displayName: 'Students',
        icon: () => <LocalLibrary />,
        children: [
          {
            path: APP_LINKS.ADD_STUDENT,
            codeName: 'add-student',
            displayName: 'Add Student',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_STUDENT,
            codeName: 'find-student',
            displayName: 'Find Student',
            icon: () => <Search />
          }
        ],
        expanded: false
      },
      {
        codeName: 'teacher-management',
        displayName: 'Teachers',
        icon: () => <School />,
        children: [
          {
            path: APP_LINKS.ADD_TEACHER,
            codeName: 'add-teacher',
            displayName: 'Add Teacher',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_TEACHER,
            codeName: 'find-teacher',
            displayName: 'Find Teacher',
            icon: () => <Search />
          }
        ],
        expanded: false
      },
      {
        codeName: 'teaching-assistant-management',
        displayName: 'Teaching Assistants',
        icon: () => <Person />,
        children: [
          {
            path: APP_LINKS.ADD_TEACHING_ASSISTANT,
            codeName: 'add-teaching-assistant',
            displayName: 'Add Assistant',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_TEACHING_ASSISTANT,
            codeName: 'find-teaching-assistant',
            displayName: 'Find Assistant',
            icon: () => <Search />
          }
        ],
        expanded: false
      },
      {
        codeName: 'subject-management',
        displayName: 'Subjects',
        icon: () => <Subject />,
        children: [
          {
            path: APP_LINKS.ADD_SUBJECT,
            codeName: 'add-subject',
            displayName: 'Add Subject',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_SUBJECT,
            codeName: 'find-subject',
            displayName: 'Find Subject',
            icon: () => <Search />
          }
        ],
        expanded: false
      },
      {
        codeName: 'role-management',
        displayName: 'Roles',
        icon: () => <AccessibilityNew />,
        children: [
          {
            path: APP_LINKS.ADD_ROLE,
            codeName: 'add-role',
            displayName: 'Add Role',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_ROLE,
            codeName: 'find-role',
            displayName: 'Find Role',
            icon: () => <Search />
          }
        ],
        expanded: false
      },
      {
        codeName: 'status-management',
        displayName: 'Status',
        icon: () => <SignalCellularAlt />,
        children: [
          {
            path: APP_LINKS.ADD_STATUS,
            codeName: 'add-status',
            displayName: 'Add Status',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_STATUS,
            codeName: 'find-status',
            displayName: 'Find Status',
            icon: () => <Search />
          }
        ],
        expanded: false
      },
      {
        codeName: 'room-management',
        displayName: 'Rooms',
        icon: () => <MeetingRoom />,
        children: [
          {
            path: APP_LINKS.ADD_ROOM,
            codeName: 'add-room',
            displayName: 'Add Room',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_ROOM,
            codeName: 'find-room',
            displayName: 'Find Room',
            icon: () => <Search />
          }
        ],
        expanded: false
      },
      {
        codeName: 'fault-management',
        displayName: 'Faults',
        icon: () => <Error />,
        children: [
          {
            path: APP_LINKS.ADD_FAULT,
            codeName: 'add-fault',
            displayName: 'Add Fault',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_FAULT,
            codeName: 'find-fault',
            displayName: 'Find Fault',
            icon: () => <Search />
          }
        ],
        expanded: false
      },
      {
        codeName: 'course-management',
        displayName: 'Courses',
        icon: () => <Bookmarks />,
        children: [
          {
            path: APP_LINKS.ADD_COURSE,
            codeName: 'add-course',
            displayName: 'Add Course',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_COURSE,
            codeName: 'find-course',
            displayName: 'Find Course',
            icon: () => <Search />
          }
        ],
        expanded: false
      }
    ]
  },
  {
    sectionId: 'advanced-management',
    sectionDisplayName: 'ADVANCED MANAGEMENT',
    items: [
      {
        codeName: 'class-management',
        displayName: 'Classes',
        icon: () => <Class />,
        children: [
          {
            path: APP_LINKS.ADD_CLASS,
            codeName: 'add-class',
            displayName: 'Add Class',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_CLASS,
            codeName: 'find-class',
            displayName: 'Find Class',
            icon: () => <Search />
          },
          {
            path: APP_LINKS.MANAGE_CLASS,
            codeName: 'manage-class',
            displayName: 'Manage Class',
            icon: () => <Manage />
          }
        ],
        expanded: false
      },
      {
        codeName: 'test-management',
        displayName: 'Tests',
        icon: () => <LibraryBooks />,
        children: [
          {
            path: APP_LINKS.ADD_TEST,
            codeName: 'add-test',
            displayName: 'Add Test',
            icon: () => <Add />
          },
          {
            path: APP_LINKS.FIND_TEST,
            codeName: 'find-test',
            displayName: 'Find Test',
            icon: () => <Search />
          }
        ],
        expanded: false
      }
    ]
  }
];

export { sidebarSections };

export default sidebarSections;
