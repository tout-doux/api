import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TodoList } from './todo-list.schema';
import { Model } from 'mongoose';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';

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
      members: [userId],
    });
    return todoList.save();
  }

  async update(
    id: string,
    updateTodoListDto: UpdateTodoListDto,
  ): Promise<TodoList | void> {
    try {
      await this.todoListModel.findByIdAndUpdate(id, updateTodoListDto);
    } catch (error) {
      throw new NotFoundException('TodoList not found');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.todoListModel.findByIdAndDelete(id);
    } catch (error) {
      throw new NotFoundException('TodoList not found');
    }
  }

  async findAllByUserId(userId: string): Promise<TodoList[]> {
    return this.todoListModel.find({ creatorId: userId }).exec();
  }
}
