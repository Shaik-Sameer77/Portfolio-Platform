import { PartialType } from '@nestjs/swagger';
import { CreateDeveloperToolDto } from './create-developer-tool.dto.js';

export class UpdateDeveloperToolDto extends PartialType(CreateDeveloperToolDto) {}
