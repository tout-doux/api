import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/user/user.schema';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String, ref: 'User', required: true })
  user: User;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
