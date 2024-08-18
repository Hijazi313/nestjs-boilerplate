import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class RefrshToken {
  @Prop({
    type: String,
    required: true,
  })
  token: string;

  @Prop({
    type: String,
    required: true,
  })
  userId: string;

  @Prop({
    type: Date,
    required: true,
  })
  expiry: Date;
}

export const RefrshTokenSchema = SchemaFactory.createForClass(RefrshToken);
