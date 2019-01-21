import { Gender } from '../../enums/GenderEnum';

interface IUpdateTeachingAssistantRequest {
  name: string;
  gender?: Gender;
  dateOfBirth?: Date;
  email?: string;
  facebook?: string;
  phone?: string;
  role?: string;
}

interface IUpdateTeachingAssistantRequestErrors {
  name: string;
  gender?: Gender;
  dateOfBirth?: Date;
  email?: string;
  facebook?: string;
  phone?: string;
  role?: string;
}

export { IUpdateTeachingAssistantRequest, IUpdateTeachingAssistantRequestErrors };

export default IUpdateTeachingAssistantRequest;
