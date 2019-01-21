import TestTaker from '../../models/Test';

interface IUpdateTestRequest extends Object {
  name?: string;
  totalMarks?: Number;
  takers?: Array<TestTaker>;
}

interface IUpdateTestRequestErrors {
  name?: string;
  totalMarks?: string;
  takers?: Array<TestTaker>;
}

export { IUpdateTestRequest, IUpdateTestRequestErrors };

export default IUpdateTestRequest;
