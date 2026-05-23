import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ example: 'electronics', description: 'Tag name (unique)' })
  @IsString()
  @MinLength(2)
  name: string;
}
