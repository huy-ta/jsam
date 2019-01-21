interface ICreateCourseRequest {
  name?: string;
  subject?: string;
  classes?: Array<String>;
}

interface ICreateCourseRequestErrors {
  name?: string;
  subject?: string;
  classes?: Array<String>;
}

export { ICreateCourseRequest, ICreateCourseRequestErrors };

export default ICreateCourseRequest;
