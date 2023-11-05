import { Module } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { TodoListController } from './todo-list.controller';
import { TodoList, TodoListSchema } from './todo-list.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TodoList.name, schema: TodoListSchema },
    ]),
  ],
  controllers: [TodoListController],
  providers: [TodoListService],
})
export class TodoListModule {}
