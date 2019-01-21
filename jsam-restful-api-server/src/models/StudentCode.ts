import mongoose from 'mongoose';
import { prop, Typegoose } from 'typegoose';

import { ModelName } from '../enums/ModelNameEnum';

class StudentCode extends Typegoose {
  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public code: string;
}

const StudentCodeModel = new StudentCode().getModelForClass(StudentCode, {
  existingMongoose: mongoose
});

if (StudentCode.name !== ModelName.STUDENT_CODE) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { StudentCode, StudentCodeModel };

export default StudentCodeModel;
