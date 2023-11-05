import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TodoListDocument = Document;

@Schema()
export class TodoList {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  creatorId: Types.ObjectId;
}

export const TodoListSchema = SchemaFactory.createForClass(TodoList);
