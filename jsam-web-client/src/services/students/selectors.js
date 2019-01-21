const getStudentById = (students, studentId) => students.filter(student => student._id === studentId)[0];

export { getStudentById };

export default getStudentById;
