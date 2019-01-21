import mongoose from 'mongoose';
import { arrayProp, prop, Typegoose, Ref } from 'typegoose';

import { WeekDay } from '../enums/WeekdayEnum';
import { ModelName } from '../enums/ModelNameEnum';
import { Room } from './Room';
import { Role } from './Role';
import { Teacher } from './Teacher';
import { Fault } from './Fault';
import { TeachingAssistant } from './TeachingAssistant';
import { Student } from './Student';
import { Class } from './Class';

class TeacherAttendance {
  @prop({ ref: Teacher })
  public teacherId: Ref<Teacher>;

  @arrayProp({ itemsRef: { name: ModelName.FAULT } })
  public faults?: Ref<Fault>[];

  @prop({ default: false })
  public present?: boolean;

  @prop()
  public salaryAmount?: number;
}

class TeachingAssistantAttendance {
  @prop({ ref: TeachingAssistant })
  public teachingAssistantId: Ref<TeachingAssistant>;

  @arrayProp({ itemsRef: { name: ModelName.FAULT } })
  public faults?: Ref<Fault>[];

  @prop({ default: false })
  public present?: boolean;

  @prop()
  public salaryAmount?: number;
}

class StudentAttendance {
  @prop({ ref: Student })
  public studentId: Ref<Student>;

  @prop({ default: false })
  public present?: boolean;

  @arrayProp({ itemsRef: Fault })
  public faults?: Ref<Fault>[];
}

class Attendance {
  @prop({ _id: false })
  public teachers: TeacherAttendance[];

  @prop({ _id: false })
  public teachingAssistants: TeachingAssistantAttendance[];

  @prop({ _id: false })
  public students: StudentAttendance[];
}

class Test {
  @prop({ _id: false })
  public name: string;

  @prop()
  public totalMarks: number;
}

class StudySession extends Typegoose {
  @prop({ required: [true, "Study session's name is required."] })
  public name: string;

  @prop({ default: false })
  public activated: boolean;

  @prop()
  public startTime?: string;

  @prop()
  public endTime?: string;

  @prop()
  public date?: Date;

  @prop({ ref: Room, required: true })
  public room?: Ref<Room>;

  @prop()
  public test?: Test;

  @prop()
  public note?: string;

  @prop()
  public homework?: string;

  @prop()
  public attendance?: Attendance;
}

const StudySessionModel = new StudySession().getModelForClass(StudySession, {
  existingMongoose: mongoose
});

if (StudySession.name !== ModelName.STUDY_SESSION) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { StudySession, StudySessionModel };

export default StudySession;
