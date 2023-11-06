import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { Todo, TodoSchema } from './todo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoList, TodoListSchema } from '../todo-list/todo-list.schema';
import { AppGateway } from 'src/app.gateway';
import { TodoEventsService } from './todo.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    MongooseModule.forFeature([
      { name: TodoList.name, schema: TodoListSchema },
    ]),
  ],
  controllers: [TodoController],
  providers: [TodoService, TodoEventsService, AppGateway],
})
export class TodoModule {}
