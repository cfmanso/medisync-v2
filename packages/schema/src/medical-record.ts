import { z } from 'zod';

export const createMedicalRecordSchema = z.object({
  description: z.string().min(10, "A descrição deve ser detalhada (mínimo 10 letras)"),
  patientId: z.string().uuid("ID do paciente inválido"),
});

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>;

export const publicMedicalRecordSchema = z.object({
  description: z.string().min(10, "A descrição deve ser detalhada (mínimo 10 letras)"),
  patientId: z.string().uuid("ID do paciente inválido"),
  date: z.coerce.date({
    errorMap: (issue, ctx) => ({ message: 'Data inválida' })
  }), 
});
export type MedicalRecordPublic = z.infer<typeof publicMedicalRecordSchema>;
