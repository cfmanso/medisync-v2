import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../api/api';
import { MedicalRecordPublic } from '@medisync/schema';

export function usePatientRecords(patientId: string) {
  return useQuery({
    queryKey: ['medical-records', patientId],
    queryFn: () => apiFetch<MedicalRecordPublic[]>(`/medical-records/patient/${patientId}`),
    enabled: !!patientId,
  });
}