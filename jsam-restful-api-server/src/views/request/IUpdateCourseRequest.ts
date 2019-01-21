interface IUpdateCourseRequest extends Object {
  name?: string;
  subject?: string;
  classes?: Array<String>;
}

interface IUpdateCourseRequestErrors {
  name?: string;
  subject?: string;
  classes?: Array<String>;
}

export { IUpdateCourseRequest, IUpdateCourseRequestErrors };

export default IUpdateCourseRequest;
