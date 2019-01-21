import { Gender } from '../../enums/GenderEnum';

interface IUpdateStudentRequest extends Object {
  name?: string;
  gender?: Gender;
  school?: string;
  phone?: {
    self?: string;
    parent?: string;
  };
  status?: string;
}

interface IUpdateStudentRequestErrors {
  name?: string;
  gender?: string;
  school?: string;
  phone?:
    | string
    | {
        self?: string;
        parent?: string;
      };
  status?: string;
}

export { IUpdateStudentRequest, IUpdateStudentRequestErrors };

export default IUpdateStudentRequest;
