import mongoose from 'mongoose';
import { prop, Ref, Typegoose } from 'typegoose';

import { Gender } from '../enums/GenderEnum';
import { Role } from './Role';

class TeachingAssistant extends Typegoose {
  @prop({ required: [true, 'Teaching assistant name is required.'] })
  public name: string;

  @prop()
  public dateOfBirth?: Date;

  @prop()
  public email?: string;

  @prop()
  public facebook?: string;

  @prop()
  public phone?: string;

  @prop({ enum: Gender })
  public gender?: Gender;

  @prop({ ref: Role })
  public role?: Ref<Role>;
}

const TeachingAssistantModel = new TeachingAssistant().getModelForClass(TeachingAssistant, {
  existingMongoose: mongoose
});

export { TeachingAssistant, TeachingAssistantModel };

export default TeachingAssistantModel;
