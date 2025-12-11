import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../api/api';
import { UpdateUserInput } from '@medisync/schema';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UpdateUserInput> }) => {
      return apiFetch(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}