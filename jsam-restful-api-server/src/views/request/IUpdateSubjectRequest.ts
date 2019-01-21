import { Gender } from '../../enums/GenderEnum';
import { Subject } from '../../models/Subject';

interface IUpdateSubjectRequest extends Object {
  name?: string;
  teachers?: Array<Subject>;
}

interface IUpdateSubjectRequestErrors {
  name?: string;
  teachers?: Array<Subject>;
}

export { IUpdateSubjectRequest, IUpdateSubjectRequestErrors };

export default IUpdateSubjectRequest;
