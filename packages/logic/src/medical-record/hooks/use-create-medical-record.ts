import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../api/api';
import { CreateMedicalRecordInput } from '@medisync/schema';


export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMedicalRecordInput) => {
      return apiFetch('/medical-records', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['medical-records', variables.patientId] 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['patient', variables.patientId] 
      });
    },
  });
}