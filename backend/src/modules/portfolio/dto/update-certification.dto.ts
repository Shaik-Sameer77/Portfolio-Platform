import { PartialType } from '@nestjs/swagger';
import { CreateCertificationDto } from './create-certification.dto.js';

export class UpdateCertificationDto extends PartialType(CreateCertificationDto) {}
