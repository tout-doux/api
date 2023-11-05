import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  listId: Types.ObjectId;
}
