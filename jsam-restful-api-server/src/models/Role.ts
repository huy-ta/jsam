import mongoose from 'mongoose';
import { prop, Typegoose } from 'typegoose';

import { ModelName } from '../enums/ModelNameEnum';

class Role extends Typegoose {
  @prop({ required: [true, 'Role name is required.'], unique: true })
  public name: string;

  @prop()
  public description?: string;
}

const RoleModel = new Role().getModelForClass(Role, {
  existingMongoose: mongoose
});

if (Role.name !== ModelName.ROLE) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { Role, RoleModel };

export default RoleModel;
