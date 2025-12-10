import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../api/proxyHandler';

interface HealthResponse {
  status: string;
  database: string;
  users: number;
}

export function useHealth() {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: () => apiFetch<HealthResponse>('/health'),
  });
}