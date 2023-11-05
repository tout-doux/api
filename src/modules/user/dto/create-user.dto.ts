import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  username: string;

  @MinLength(8)
  @IsString()
  @ApiProperty()
  password: string;
}
