import { Gender } from '../../enums/GenderEnum';
import { Subject } from "../../models/Subject";

interface ICreateSubjectRequest extends Object {
  name?: string;
  teachers?: Array<Subject>;
}

interface ICreateSubjectRequestErrors {
  name?: string;
  teachers?: Array<Subject>;
}

export { ICreateSubjectRequest, ICreateSubjectRequestErrors };

export default ICreateSubjectRequest;
