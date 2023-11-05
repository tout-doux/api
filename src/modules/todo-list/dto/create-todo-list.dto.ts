import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTodoListDto {
  @IsString()
  @ApiProperty()
  name: string;
}
