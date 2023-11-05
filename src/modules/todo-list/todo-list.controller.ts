import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TodoList } from './todo-list.schema';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('todo-lists')
@Controller('todo-lists')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create todo list' })
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

  @Put(':id')
  @ApiOperation({ summary: 'Update todo list' })
  @ApiResponse({
    status: 200,
    description: 'The todo list has been successfully updated.',
    type: TodoList,
  })
  async update(
    @Body() updateTodoListDto: UpdateTodoListDto,
    @Param('id') id,
  ): Promise<TodoList | void> {
    return await this.todoListService.update(id, updateTodoListDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete todo list' })
  @ApiResponse({
    status: 200,
    description: 'The todo list has been successfully deleted.',
    type: TodoList,
  })
  async delete(@Param('id') id): Promise<void> {
    await this.todoListService.delete(id);
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
