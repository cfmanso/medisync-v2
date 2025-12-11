import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../api/api';
import { RegisterUserInput } from '@medisync/schema';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterUserInput) => {
      return apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}