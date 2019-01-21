import mongoose from 'mongoose';
import { prop, Typegoose } from 'typegoose';

import { ModelName } from '../enums/ModelNameEnum';

class Status extends Typegoose {
  @prop({ required: [true, 'Status name is required.'], unique: true })
  public name: string;

  @prop()
  public description?: string;
}

const StatusModel = new Status().getModelForClass(Status, {
  existingMongoose: mongoose
});

if (Status.name !== ModelName.STATUS) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { Status, StatusModel };

export default StatusModel;
