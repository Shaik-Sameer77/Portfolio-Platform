import { PartialType } from '@nestjs/swagger';
import { CreateUsesItemDto } from './create-uses-item.dto.js';

export class UpdateUsesItemDto extends PartialType(CreateUsesItemDto) {}
