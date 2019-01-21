import mongoose from 'mongoose';

import { ModelName } from '../enums/ModelNameEnum';
import { Teacher } from './Teacher';
import { prop, Typegoose, Ref, arrayProp } from 'typegoose';

class Subject extends Typegoose {
  @prop({ required: [true, 'Subject name is required.'] })
  public name: string;

  @arrayProp({ itemsRef: { name: ModelName.TEACHER } })
  public teachers?: Ref<Teacher>[];
}

const SubjectModel = new Subject().getModelForClass(Subject, {
  existingMongoose: mongoose
});

if (Subject.name !== ModelName.SUBJECT) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { Subject, SubjectModel };

export default SubjectModel;
