import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  title: string;

  @ApiProperty()
  listId: Types.ObjectId;
}
