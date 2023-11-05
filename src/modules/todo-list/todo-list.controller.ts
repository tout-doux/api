import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TodoList } from './todo-list.schema';

@UseGuards(JwtAuthGuard)
@ApiTags('todo-lists')
@Controller('todo-lists')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create my todo list' })
  @ApiResponse({
    status: 200,
    description: 'The todo list has been successfully created.',
    type: TodoList,
  })
  create(
    @Body() createTodoListDto: CreateTodoListDto,
    @Req() req,
  ): Promise<TodoList> {
    return this.todoListService.create(createTodoListDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all my todo lists' })
  @ApiResponse({
    status: 200,
    description: 'Return all my todo-lists.',
    type: [TodoList],
  })
  findAllByUserId(@Req() req): Promise<TodoList[]> {
    return this.todoListService.findAllByUserId(req.user.userId);
  }
}
