import mongoose from 'mongoose';
import { prop, Typegoose, arrayProp, Ref } from 'typegoose';

import { Teacher } from './Teacher';
import { Student } from './Student';
import { StudySession } from './StudySession';
import { TeachingAssistant } from './TeachingAssistant';
import { Role } from './Role';
import { WeekDay } from '../enums/WeekdayEnum';
import { ModelName } from '../enums/ModelNameEnum';

class StudyPhaseTeacher {
  @prop({ ref: Teacher, required: [true, "Teacher's id is required"] })
  public teacherId: Teacher;

  @prop()
  public teacherName?: string;

  @prop({ ref: Role })
  public roleId?: Role;

  @prop()
  public roleName?: string;
}

class StudyPhaseTeachingAssistant {
  @prop({ ref: TeachingAssistant, required: [true, "Teaching assistant's id is required"] })
  public teachingAssistantId: TeachingAssistant;

  @prop()
  public teachingAssistantName?: string;

  @prop({ ref: Role })
  public role?: Role;

  @prop()
  public roleName?: string;
}

class StudyPhaseStudent {
  @prop({ ref: Student, required: [true, "Student's id is required"] })
  public studentId: Student;

  @prop()
  public studentName?: string;

  @prop()
  public studentCode?: string;

  @prop()
  public paidFee?: number;

  @prop({ required: [true, 'You must specify the fee this student has to pay.'] })
  public feeToPay: number;
}

class StudyPhase extends Typegoose {
  @prop({ required: [true, "Study phase's name is required."] })
  public name: string;

  @prop({ required: [true, 'Start date is required.'] })
  public startDate: Date;

  @prop()
  public endDate?: Date;

  @prop({ _id: false })
  public teachers?: StudyPhaseTeacher[];

  @prop({ _id: false })
  public teachingAssistants?: StudyPhaseTeachingAssistant[];

  @prop({ _id: false })
  public students?: StudyPhaseStudent[];

  @prop({ required: true })
  public phaseFee: number;

  @arrayProp({ itemsRef: StudySession })
  public sessions?: Ref<StudySession>[];
}

const StudyPhaseModel = new StudyPhase().getModelForClass(StudyPhase, {
  existingMongoose: mongoose
});

if (StudyPhase.name !== ModelName.STUDY_PHASE) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { StudyPhase, StudyPhaseModel };

export default StudyPhase;
