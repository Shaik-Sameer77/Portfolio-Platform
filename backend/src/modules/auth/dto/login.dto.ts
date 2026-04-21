import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'sameer.developer14@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '@Rajabali77' })
  @IsString()
  @MinLength(6)
  password: string;
}
