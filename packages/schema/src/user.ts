import { z } from 'zod';

export const userPublicSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["DOCTOR", "PATIENT", "ADMIN"]),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()).optional(),

  permissions: z.string().nullable().optional(),
});

export const registerUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 letras"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional().or(z.literal('')),
  role: z.enum(["DOCTOR", "PATIENT", "ADMIN"]),
});

export const updateUserSchema = registerUserSchema.partial().extend({

});

// casl
const caslActionSchema = z.enum(['manage', 'create', 'read', 'update', 'delete']);
const caslSubjectSchema = z.enum(['User', 'Appointment', 'MedicalRecord', 'all']);

const caslRuleSchema = z.object({
  action: caslActionSchema,
  subject: caslSubjectSchema,
  conditions: z.record(z.any()).optional(), 
  inverted: z.boolean().optional(),
  reason: z.string().optional(),
});

export const updatePermissionsSchema = z.object({
  permissions: z.array(caslRuleSchema),
});

export type CaslRule = z.infer<typeof caslRuleSchema>;
export type UpdatePermissionsInput = z.infer<typeof updatePermissionsSchema>;
export type UserPublic = z.infer<typeof userPublicSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export interface PaginatedUsers {
  data: UserPublic[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}