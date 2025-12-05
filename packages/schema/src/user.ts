import { z } from 'zod';

export const userPublicSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const registerUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 letras"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["DOCTOR", "PATIENT", "ADMIN"]),
});

export type UserPublic = z.infer<typeof userPublicSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
}