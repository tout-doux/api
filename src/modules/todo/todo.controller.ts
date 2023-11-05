import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './todo.schema';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create my todo' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully created.',
    type: Todo,
  })
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req,
  ): Promise<Todo> {
    return this.todoService.create(createTodoDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all my todos' })
  @ApiResponse({
    status: 200,
    description: 'Return all my todos.',
    type: [Todo],
  })
  async findAllByUserId(@Req() req): Promise<Todo[]> {
    return this.todoService.findAllByUserId(req.user.userId);
  }
}
