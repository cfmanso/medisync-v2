import { createZodDto } from 'nestjs-zod';
import { updatePermissionsSchema } from '@medisync/schema';

export class UpdatePermissionsDto extends createZodDto(
  updatePermissionsSchema,
) {}
