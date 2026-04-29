import { PartialType } from '@nestjs/swagger';
import { CreateStatDto } from './create-stat.dto.js';

export class UpdateStatDto extends PartialType(CreateStatDto) {}
