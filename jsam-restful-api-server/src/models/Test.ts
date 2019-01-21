import mongoose from 'mongoose';
import { prop, Typegoose } from 'typegoose';

import { ModelName } from '../enums/ModelNameEnum';
import { Student } from './Student';

class TestTaker {
  @prop({ ref: Student, required: [true, "Student's id is required"] })
  public studentId: Student;

  @prop()
  public mark?: Number;

  @prop()
  public date?: Date;
}
class Test extends Typegoose {
  @prop({ required: [true, 'Test name is required.'] })
  public name: string;

  @prop()
  public totalMarks?: Number;

  @prop({ _id: false })
  public takers?: TestTaker[];
}

const TestModel = new Test().getModelForClass(Test, {
  existingMongoose: mongoose
});

if (Test.name !== ModelName.TEST) {
  throw new Error(
    `Typegoose Model Class name doesn't match that of ModelName enums.`
  );
}

export { Test, TestModel };

export default Test;
