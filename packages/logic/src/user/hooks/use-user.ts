import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../api/api';
import { UserPublic } from '@medisync/schema'

export function useUser(id: string) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => apiFetch<UserPublic>(`/users/${id}`),
    enabled: !!id,
  });
}