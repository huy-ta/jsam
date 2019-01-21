const getTeacherById = (teachers, teacherId) => teachers.filter(teacher => teacher._id === teacherId)[0];

export { getTeacherById };

export default getTeacherById;
