import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdatePermissionsInput } from '@medisync/schema';
import { apiFetch } from '../../api/api'

export function useUpdatePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdatePermissionsInput }) => {
      return apiFetch(`/users/${userId}/permissions`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}