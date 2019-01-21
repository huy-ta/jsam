import mongoose from 'mongoose';
import { prop, Typegoose } from 'typegoose';

import { ModelName } from '../enums/ModelNameEnum';

class Room extends Typegoose {
  @prop({ required: [true, 'Room name is required.'], unique: true })
  public name: string;

  @prop({ required: [true, 'Room floor is required.'] })
  public floor: string;

  @prop()
  public capacity?: number;
}

const RoomModel = new Room().getModelForClass(Room, {
  existingMongoose: mongoose
});

if (Room.name !== ModelName.ROOM) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { Room, RoomModel };

export default RoomModel;
