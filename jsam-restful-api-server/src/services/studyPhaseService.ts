import { TeacherModel } from '../models/Teacher';
import { TeachingAssistantModel } from '../models/TeachingAssistant';
import { StudentModel } from '../models/Student';
import { RoleModel } from '../models/Role';
import { StudyPhaseModel } from '../models/StudyPhase';

const denormNewlyAddedTeachers = async (studyPhase, reqTeachersLength) => {
  const teacherListLength = studyPhase.teachers.length;

  const denormTeachers = async () => {
    for (let i = teacherListLength - reqTeachersLength; i < teacherListLength; i++) {
      const teacher = studyPhase.teachers[i];
      const foundTeacher = await TeacherModel.findOne({ _id: teacher.teacherId });
      const foundRole = await RoleModel.findOne({ _id: teacher.roleId });
      teacher.teacherName = foundTeacher.name;
      teacher.roleName = foundRole.name;
      studyPhase.teachers[i] = teacher;
    }
  };

  await denormTeachers();

  studyPhase.markModified('teachers');

  await studyPhase.save();
};

const denormStudyPhaseTeachers = async studyPhase => {
  await Promise.all(
    studyPhase.teachers.map(async teacher => {
      const foundTeacher = await TeacherModel.findOne({ _id: teacher.teacherId });
      const foundRole = await RoleModel.findOne({ _id: teacher.roleId });
      teacher.teacherName = foundTeacher.name;
      teacher.roleName = foundRole.name;
      return teacher;
    })
  );

  // I just ran into a similar issue in my code.
  // For mine, I was dealing with an object within my user document.
  // I had to run a user.markModified('object') before the user.save() to ensure the changes were saved to the database.
  // My running theory is that Mongoose wasn't tracking items unset or removed from the database automatically.
  studyPhase.markModified('teachers');

  await studyPhase.save();
};

const denormAllStudyPhaseTeachers = async teacherId => {
  const foundStudyPhases = await StudyPhaseModel.find();

  await Promise.all(
    foundStudyPhases.map(async studyPhase => {
      if (studyPhase.teachers.find(teacher => teacher.teacherId === teacherId)) {
        await denormStudyPhaseTeachers(studyPhase);
      }
    })
  );
};

const denormNewlyAddedTeachingAssistants = async (studyPhase, reqTeachingAssistantsLength) => {
  const teachingAssistantListLength = studyPhase.teachingAssistants.length;

  const denormTeachingAssistants = async () => {
    for (let i = teachingAssistantListLength - reqTeachingAssistantsLength; i < teachingAssistantListLength; i++) {
      const teachingAssistant = studyPhase.teachingAssistants[i];
      const foundTeachingAssistant = await TeachingAssistantModel.findOne({
        _id: teachingAssistant.teachingAssistantId
      });
      const foundRole = await RoleModel.findOne({ _id: teachingAssistant.roleId });
      teachingAssistant.teachingAssistantName = foundTeachingAssistant.name;
      teachingAssistant.roleName = foundRole.name;
      studyPhase.teachingAssistants[i] = teachingAssistant;
    }
  };

  await denormTeachingAssistants();

  studyPhase.markModified('teachingAssistants');

  await studyPhase.save();
};

const denormStudyPhaseTeachingAssistants = async studyPhase => {
  await Promise.all(
    studyPhase.teachingAssistants.map(async teachingAssistant => {
      const foundTeachingAssistant = await TeachingAssistantModel.findOne({
        _id: teachingAssistant.teachingAssistantId
      });
      const foundRole = await RoleModel.findOne({ _id: teachingAssistant.roleId });
      teachingAssistant.teachingAssistantName = foundTeachingAssistant.name;
      teachingAssistant.roleName = foundRole.name;
      return teachingAssistant;
    })
  );

  studyPhase.markModified('teachingAssistants');

  await studyPhase.save();
};

const denormAllStudyPhaseTeachingAssistants = async teachingAssistantId => {
  const foundStudyPhases = await StudyPhaseModel.find();

  await Promise.all(
    foundStudyPhases.map(async studyPhase => {
      if (
        studyPhase.teachingAssistants.find(
          teachingAssistant => teachingAssistant.teachingAssistantId === teachingAssistantId
        )
      ) {
        await denormStudyPhaseTeachingAssistants(studyPhase);
      }
    })
  );
};

const denormNewlyAddedStudents = async (studyPhase, reqStudentsLength) => {
  const studentListLength = studyPhase.students.length;

  const denormStudents = async () => {
    for (let i = studentListLength - reqStudentsLength; i < studentListLength; i++) {
      const student = studyPhase.students[i];
      const foundStudent = await StudentModel.findOne({ _id: student.studentId });
      student.studentName = foundStudent.name;
      student.studentCode = foundStudent.code;
      studyPhase.students[i] = student;
    }
  };

  await denormStudents();

  studyPhase.markModified('students');

  await studyPhase.save();
};

const denormStudyPhaseStudents = async studyPhase => {
  await Promise.all(
    studyPhase.students.map(async student => {
      const foundStudent = await StudentModel.findOne({ _id: student.studentId });
      student.studentName = foundStudent.name;
      student.school = foundStudent.school;
      return student;
    })
  );

  studyPhase.markModified('students');

  await studyPhase.save();
};

const denormAllStudyPhaseStudents = async studentId => {
  const foundStudyPhases = await StudyPhaseModel.find();

  await Promise.all(
    foundStudyPhases.map(async studyPhase => {
      if (studyPhase.students.find(student => student.studentId === studentId)) {
        await denormStudyPhaseStudents(studyPhase);
      }
    })
  );
};

export {
  denormNewlyAddedTeachers,
  denormStudyPhaseTeachers,
  denormAllStudyPhaseTeachers,
  denormNewlyAddedTeachingAssistants,
  denormStudyPhaseTeachingAssistants,
  denormAllStudyPhaseTeachingAssistants,
  denormNewlyAddedStudents,
  denormStudyPhaseStudents,
  denormAllStudyPhaseStudents
};

export default denormStudyPhaseTeachers;
