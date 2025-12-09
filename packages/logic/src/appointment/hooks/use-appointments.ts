import { useQuery } from '@tanstack/react-query';
import { apiFetch} from '../../api/api'
import { AppointmentResponse } from '@medisync/schema';

export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () => apiFetch<AppointmentResponse[]>('/appointments'),
    staleTime: 1000 * 60, 
  });
}