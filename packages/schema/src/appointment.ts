import { z } from 'zod';

export const createAppointmentSchema = z.object({
  date: z.string().datetime({
    message: 'Data inválida. Use formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)'
  }),  
  reason: z.string().optional(), 
  
  doctorId: z.string().uuid("ID do médico inválido"),
  patientId: z.string().uuid("ID do paciente inválido"),
});


// Schema para quando for CANCELAR ou ATUALIZAR
export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"]),
});

export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

interface UserSummary {
  id: string;
  name: string;
  email?: string;
}

export interface AppointmentResponse {
  id: string;
  date: string; 
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';
  reason?: string | null;
  
  doctor: UserSummary;
  patient: UserSummary;
}