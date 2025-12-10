import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch} from '../../api/api'
import { AppointmentResponse, CreateAppointmentInput } from '@medisync/schema';

export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () => apiFetch<AppointmentResponse[]>('/appointments'),
    staleTime: 1000 * 60, 
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentInput) => {
      return apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}