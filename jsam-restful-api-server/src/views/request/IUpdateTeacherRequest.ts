import { Gender } from '../../enums/GenderEnum';

interface IUpdateTeacherRequest {
  name: string;
  gender?: Gender;
  dateOfBirth?: Date;
  email?: string;
  facebook?: string;
  phone?: string;
  speciality?: string;
}

interface IUpdateTeacherRequestErrors {
  name?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  email?: string;
  facebook?: string;
  phone?: string;
  speciality?: string;
}

export { IUpdateTeacherRequest, IUpdateTeacherRequestErrors };

export default IUpdateTeacherRequest;
