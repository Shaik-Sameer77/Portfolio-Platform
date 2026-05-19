import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAboutSectionDto {
  @ApiPropertyOptional({ example: "I'm Shaik, a full-stack engineer..." })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: "I build event-driven backends..." })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ example: "How I got here" })
  @IsOptional()
  @IsString()
  storyTitle?: string;

  @ApiPropertyOptional({ example: "I started writing code because..." })
  @IsOptional()
  @IsString()
  storyText?: string;

  @ApiPropertyOptional({ example: "A camera, mostly." })
  @IsOptional()
  @IsString()
  beyondTitle?: string;

  @ApiPropertyOptional({ example: "Outside of building software, I take photos..." })
  @IsOptional()
  @IsString()
  beyondText?: string;

  @ApiPropertyOptional({ example: "https://res.cloudinary.com/..." })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
