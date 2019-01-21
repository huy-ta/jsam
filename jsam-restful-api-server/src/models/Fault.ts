import mongoose from 'mongoose';
import { prop, Typegoose } from 'typegoose';

import { ModelName } from '../enums/ModelNameEnum';

class Fault extends Typegoose {
  @prop({ required: [true, 'Fault name is required.'] })
  public name: string;

  @prop()
  public description?: string;
}

const FaultModel = new Fault().getModelForClass(Fault, {
  existingMongoose: mongoose
});

if (Fault.name !== ModelName.FAULT) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { Fault, FaultModel };

export default FaultModel;
