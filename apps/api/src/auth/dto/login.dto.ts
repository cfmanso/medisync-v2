import { createZodDto } from 'nestjs-zod';
import { loginSchema } from '@medisync/schema';

export class LoginDto extends createZodDto(loginSchema) {}
