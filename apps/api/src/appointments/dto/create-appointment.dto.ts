import { createAppointmentSchema } from '@medisync/schema';
import { createZodDto } from 'nestjs-zod';

export class CreateAppointmentDto extends createZodDto(
  createAppointmentSchema,
) {}
