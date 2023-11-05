import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

export type TodoListDocument = Document;

@Schema()
export class TodoList {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  creatorId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: User[];
}

export const TodoListSchema = SchemaFactory.createForClass(TodoList);
