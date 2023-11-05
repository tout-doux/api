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
    console.log(createTodoDto);
    createTodoDto.listId = new Types.ObjectId(createTodoDto.listId);
    const list = await this.todoListModel.findById(createTodoDto.listId);
    if (!list) {
      throw new NotFoundException('TodoList not found');
    }

    if (list.creatorId.toString() !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to add a todo to this list',
      );
    }

    const todo = new this.todoModel(createTodoDto);
    return todo.save();
  }

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const lists = await this.todoListModel
      .find({ creatorId: userId })
      .select('_id');
    console.log(lists);
    const listIds = lists.map((list) => list._id);
    console.log(listIds);
    const todos = await this.todoModel.find({ listId: { $in: listIds } });
    return todos;
  }
}
