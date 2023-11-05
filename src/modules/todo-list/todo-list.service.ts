import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TodoList } from './todo-list.schema';
import { Model } from 'mongoose';

@Injectable()
export class TodoListService {
  constructor(
    @InjectModel(TodoList.name) private todoListModel: Model<TodoList>,
  ) {}

  async create(
    createTodoListDto: CreateTodoListDto,
    userId: string,
  ): Promise<TodoList> {
    const todoList = new this.todoListModel({
      ...createTodoListDto,
      creatorId: userId,
    });
    return todoList.save();
  }

  async findAllByUserId(userId: string): Promise<TodoList[]> {
    return this.todoListModel.find({ creatorId: userId }).exec();
  }
}
