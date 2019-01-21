import mongoose from 'mongoose';
import { prop, Typegoose, Ref } from 'typegoose';

import { Course } from './Course';
import { StudyPhase } from './StudyPhase';
import { WeekDay } from '../enums/WeekdayEnum';
import { Room } from './Room';
import { ModelName } from '../enums/ModelNameEnum';

class Schedule {
  @prop({ enum: WeekDay })
  public weekDay: WeekDay;

  @prop()
  public startTime: string;

  @prop()
  public endTime: string;

  @prop({ ref: Room })
  public room: Ref<Room>;
}

class DenormalizedCourse {
  @prop({ ref: Course })
  public courseId?: Ref<Course>;

  @prop()
  public name?: string;
}

class DenormalizedPhase {
  @prop({ ref: { name: ModelName.STUDY_PHASE } })
  public phaseId?: Ref<StudyPhase>;

  @prop()
  public name?: string;

  @prop()
  public startDate?: Date;

  @prop()
  public endDate?: Date;
}

class Class extends Typegoose {
  @prop({ required: [true, 'Class name is required.'] })
  public name: string;

  @prop({ _id: false })
  public course?: DenormalizedCourse;

  @prop({ _id: false })
  public normalSchedule?: Schedule[];

  @prop({ _id: false })
  public phases?: DenormalizedPhase[];
}

const ClassModel = new Class().getModelForClass(Class, {
  existingMongoose: mongoose
});

export { Class, ClassModel };

export default Class;
