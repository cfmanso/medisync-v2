import { z } from 'zod';

export const createMedicalRecordSchema = z.object({
  description: z.string().min(10, "A descrição deve ser detalhada (mínimo 10 letras)"),
  patientId: z.string().uuid("ID do paciente inválido"),
});

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>;