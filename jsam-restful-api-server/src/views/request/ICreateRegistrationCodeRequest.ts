import { UserType } from '../../enums/UserTypeEnum';

interface ICreateRegistrationCodeRequest {
  userType: UserType;
  validPeriod?: number;
}

interface ICreateRegistrationCodeRequestErrors {
  userType?: string;
  validPeriod?: string;
}

export { ICreateRegistrationCodeRequest, ICreateRegistrationCodeRequestErrors };

export default ICreateRegistrationCodeRequest;
