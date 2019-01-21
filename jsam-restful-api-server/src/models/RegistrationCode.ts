import mongoose from 'mongoose';
import { prop, pre, Typegoose } from 'typegoose';

import { ModelName } from '../enums/ModelNameEnum';
import { UserType } from '../enums/UserTypeEnum';

const generateRegistrationCode = codeLength => {
  const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomRegistrationCode = '';
  let randomChar;

  for (let i = 0; i < codeLength; i = i + 1) {
    randomChar = Math.floor(Math.random() * chars.length);
    randomRegistrationCode += chars.substring(randomChar, randomChar + 1);
  }

  return randomRegistrationCode;
};

@pre<RegistrationCode>('save', function(next) {
  this.createdDate = new Date();
  this.code = generateRegistrationCode(10);
  next();
})
class RegistrationCode extends Typegoose {
  @prop({ unique: true })
  public code?: string;

  @prop({ required: true, enum: UserType })
  public userType: UserType;

  @prop()
  public createdDate?: Date;

  @prop()
  public validPeriod?: number;
}

const RegistrationCodeModel = new RegistrationCode().getModelForClass(RegistrationCode, {
  existingMongoose: mongoose
});

if (RegistrationCode.name !== ModelName.REGISTRATION_CODE) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { RegistrationCodeModel };

export default RegistrationCodeModel;
