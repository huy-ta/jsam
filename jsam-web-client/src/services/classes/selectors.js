const getPreSelectedClass = classes => {
  const selectedClassId = sessionStorage.getItem('selectedClass');
  const filteredClasses = classes.filter(studentClass => studentClass._id === selectedClassId);
  if (filteredClasses[0]) {
    const preSelectedClass = {
      value: filteredClasses[0]._id,
      label: `${filteredClasses[0].name} - ${filteredClasses[0].course.name}`,
      ...filteredClasses[0]
    };
    return preSelectedClass;
  }
  return undefined;
};

export { getPreSelectedClass };

export default getPreSelectedClass;
