import { Gender } from '../../enums/GenderEnum';

interface ICreateTeacherRequest {
  name: string;
  gender?: Gender;
  dateOfBirth?: Date;
  email?: string;
  facebook?: string;
  phone?: string;
  speciality?: string;
}

interface ICreateTeacherRequestErrors {
  name?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  email?: string;
  facebook?: string;
  phone?: string;
  speciality?: string;
}

export { ICreateTeacherRequest, ICreateTeacherRequestErrors };

export default ICreateTeacherRequest;
