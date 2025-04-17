import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { LocationCoordinates } from '../types/common';

@Schema({ timestamps: true })
export class User extends AbstractDocument {
  @Prop(String)
  firstName: string;

  @Prop(String)
  lastName: string;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop(String)
  nickname: string;

  @Prop()
  password: string;

  @Prop()
  address: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  position: string;

  @Prop({ default: false })
  isCaptain: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Session', default: null })
  currentSession: string;

  @Prop({ type: Number, default: null })
  otp: number;

  @Prop({ type: Date, default: null })
  otpExpiration: Date;

  @Prop({ type: Boolean, default: null })
  otpVerified: boolean;

  @Prop({
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  })
  location: LocationCoordinates;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ location: '2dsphere' });
