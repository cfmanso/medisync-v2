import { createMedicalRecordSchema } from '@medisync/schema';
import { createZodDto } from 'nestjs-zod';

export class CreateMedicalRecordDto extends createZodDto(
  createMedicalRecordSchema,
) {}
