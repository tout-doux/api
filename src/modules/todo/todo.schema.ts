import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo>;

@Schema()
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: false })
  completed: boolean;

  @Prop({ required: false, type: Types.ObjectId, ref: 'TodoList' })
  listId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  creatorId: Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
