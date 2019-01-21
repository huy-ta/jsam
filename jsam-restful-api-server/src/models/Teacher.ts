import mongoose from 'mongoose';
import { prop, Typegoose, Ref } from 'typegoose';

import { Gender } from '../enums/GenderEnum';
import { ModelName } from '../enums/ModelNameEnum';
import { Subject } from './Subject';

class Teacher extends Typegoose {
  @prop({ required: [true, 'Teacher name is required.'] })
  public name: string;

  @prop()
  public dateOfBirth?: Date;

  @prop()
  public email?: string;

  @prop()
  public facebook?: string;

  @prop({ _id: false })
  public phone?: string;

  @prop({ enum: Gender })
  public gender?: Gender;

  @prop({ ref: Subject })
  public speciality?: Ref<Subject>;
}

const TeacherModel = new Teacher().getModelForClass(Teacher, {
  existingMongoose: mongoose
});

if (Teacher.name !== ModelName.TEACHER) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { Teacher, TeacherModel };

export default TeacherModel;
