import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  UseGuards,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './todo.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateTodoDto } from './dto/update-todo.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('todos')
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

  @Put(':id')
  @ApiOperation({ summary: 'Update todo' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully updated.',
    type: Todo,
  })
  async update(
    @Body() updateTodoDto: UpdateTodoDto,
    @Param('id') id,
  ): Promise<Todo | void> {
    return await this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete todo' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully deleted.',
  })
  async delete(@Param('id') id): Promise<void> {
    await this.todoService.delete(id);
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
