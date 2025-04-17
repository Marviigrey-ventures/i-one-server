import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export class Set extends AbstractDocument {
  @Prop({ type: Types.ObjectId, ref: 'Session' })
  session: string;

  @Prop(String)
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  players: string[];
}
export const SetSchema = SchemaFactory.createForClass(Set);
