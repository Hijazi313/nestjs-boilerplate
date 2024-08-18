import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({})
export class User extends Document {
  @Prop({
    type: SchemaTypes.ObjectId,
    auto: true,
  })
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 6,
  })
  password: string;

  @Prop({
    type: String,
    default: null,
  })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
