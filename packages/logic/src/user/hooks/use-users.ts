import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../api/api';
import { PaginatedUsers } from '@medisync/schema';

export function useUsers(role?: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['users', role, page, limit], 
    queryFn: () => {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      return apiFetch<PaginatedUsers>(`/users?${params.toString()}`);
    },
    // Mantém os dados antigos na tela enquanto carrega a próxima página
    placeholderData: (previousData) => previousData, 
  });
}