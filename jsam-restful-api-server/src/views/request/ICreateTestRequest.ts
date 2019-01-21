import TestTaker from '../../models/Test';

interface ICreateTestRequest extends Object {
  name?: string;
  totalMarks?: Number;
  takers?: Array<TestTaker>;
}

interface ICreateTestRequestErrors {
  name?: string;
  totalMarks?: string;
  takers?: Array<TestTaker>;
}

export { ICreateTestRequest, ICreateTestRequestErrors };

export default ICreateTestRequest;
