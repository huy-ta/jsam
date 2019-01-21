import mongoose from 'mongoose';
import { prop, Typegoose, Ref } from 'typegoose';

import { ModelName } from '../enums/ModelNameEnum';
import { Gender } from '../enums/GenderEnum';

import { Status } from './Status';
class Phone {
  @prop()
  public self?: string;

  @prop()
  public parent?: string;
}

class Student extends Typegoose {
  @prop({ required: [true, 'Student name is required.'] })
  public name: string;

  @prop({ required: true, unique: true })
  public code: string;

  @prop()
  public school?: string;

  @prop({ _id: false })
  public phone?: Phone;

  @prop({ enum: Gender })
  public gender?: Gender;

  @prop({ ref: Status })
  public status?: Ref<Status>;
}

const StudentModel = new Student().getModelForClass(Student, {
  existingMongoose: mongoose
});

if (Student.name !== ModelName.STUDENT) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { Student, StudentModel };

export default StudentModel;
