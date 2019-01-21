import mongoose from 'mongoose';
import { prop, Typegoose, Ref, arrayProp } from 'typegoose';

import { Subject } from './Subject';
import { Class } from './Class';

class Course extends Typegoose {
  @prop({ required: [true, 'Course name is required.'] })
  public name: string;

  @prop({ ref: Subject })
  public subject: Ref<Subject>;

  @arrayProp({ itemsRef: { name: 'Class' } })
  public classes: Ref<Class>[];
}

const CourseModel = new Course().getModelForClass(Course, {
  existingMongoose: mongoose
});

export { Course, CourseModel };

export default Course;
