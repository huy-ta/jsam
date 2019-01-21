const getTeachingAssistantById = (teachingAssistants, teachingAssistantId) =>
  teachingAssistants.filter(teachingAssistant => teachingAssistant._id === teachingAssistantId)[0];

export { getTeachingAssistantById };

export default getTeachingAssistantById;
