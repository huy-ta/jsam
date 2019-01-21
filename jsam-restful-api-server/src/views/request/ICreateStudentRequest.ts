import { Gender } from '../../enums/GenderEnum';

interface ICreateStudentRequest {
  name: string;
  gender?: Gender;
  school?: string;
  phone?: {
    self?: string;
    parent?: string;
  };
  status?: string;
}

interface ICreateStudentRequestErrors {
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

export { ICreateStudentRequest, ICreateStudentRequestErrors };

export default ICreateStudentRequest;
