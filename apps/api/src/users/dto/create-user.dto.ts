import { registerUserSchema } from '@medisync/schema';
import { createZodDto } from 'nestjs-zod';

export class CreateUserDto extends createZodDto(registerUserSchema) {}
