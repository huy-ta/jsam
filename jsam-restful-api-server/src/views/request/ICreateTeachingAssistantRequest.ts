import { Gender } from '../../enums/GenderEnum';

interface ICreateTeachingAssistantRequest {
  name: string;
  gender?: Gender;
  dateOfBirth?: Date;
  email?: string;
  facebook?: string;
  phone?: string;
  role?: string;
}

interface ICreateTeachingAssistantRequestErrors {
  name?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  email?: string;
  facebook?: string;
  phone?: string;
  role?: string;
}

export { ICreateTeachingAssistantRequest, ICreateTeachingAssistantRequestErrors };

export default ICreateTeachingAssistantRequest;
