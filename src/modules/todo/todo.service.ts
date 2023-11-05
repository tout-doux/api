import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TodoList } from '../todo-list/todo-list.schema';
import { Model, Types } from 'mongoose';
import { Todo } from './todo.schema';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(TodoList.name) private todoListModel: Model<TodoList>,
    @InjectModel(Todo.name) private todoModel: Model<Todo>,
  ) {}
  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    createTodoDto.listId = new Types.ObjectId(createTodoDto.listId);

    if (createTodoDto.listId) {
      const list = await this.todoListModel.findById(createTodoDto.listId);
      if (!list) {
        throw new NotFoundException('TodoList not found');
      }

      if (list.creatorId.toString() !== userId) {
        throw new UnauthorizedException(
          'You do not have permission to add a todo to this list',
        );
      }
    }

    const todo = new this.todoModel({
      ...createTodoDto,
      creatorId: userId,
    });

    return todo.save();
  }

  async update(id: string, updateTodoDto: CreateTodoDto): Promise<Todo | void> {
    try {
      return this.todoModel.findByIdAndUpdate(id, updateTodoDto);
    } catch (error) {
      throw new NotFoundException('Todo not found');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.todoModel.findByIdAndDelete(id);
    } catch (error) {
      throw new NotFoundException('Todo not found');
    }
  }

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const lists = await this.todoListModel
      .find({
        $or: [{ creatorId: userId }, { members: { $in: [userId] } }],
      })
      .select('_id');
    const listIds = lists.map((list) => list._id);
    const todos = await this.todoModel.find({ listId: { $in: listIds } });
    return todos;
  }
}
