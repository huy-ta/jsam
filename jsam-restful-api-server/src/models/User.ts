import mongoose from 'mongoose';
import { prop, Typegoose } from 'typegoose';

import { ModelName } from '../enums/ModelNameEnum';
import { UserType } from '../enums/UserTypeEnum';

class User extends Typegoose {
  @prop({ required: [true, 'Email is required.'] })
  public email: string;

  @prop({ required: [true, 'Password is required.'] })
  public password: string;

  @prop({ enum: UserType, required: [true, 'User type is required.'] })
  public userType: UserType;
}

const UserModel = new User().getModelForClass(User, {
  existingMongoose: mongoose
});

if (User.name !== ModelName.USER) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { User, UserModel };

export default UserModel;
