import { ClassModel } from '../models/Class';

const denormClassCourse = async (studentClass, course) => {
  studentClass.course = {
    courseId: studentClass.course.courseId,
    name: course.name
  };

  studentClass.markModified('course');

  await studentClass.save();
};

const denormAllClassesCourse = async course => {
  await Promise.all(
    course.classes.map(async classId => {
      const studentClass = await ClassModel.findOne({ _id: classId });
      await denormClassCourse(studentClass, course);
    })
  );
};

export { denormClassCourse, denormAllClassesCourse };

export default denormClassCourse;
